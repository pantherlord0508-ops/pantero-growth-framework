import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-response";
import { createLogger } from "@/lib/logger";
import { generateUniqueReferralCode } from "@/lib/services/waitlist";

const log = createLogger({ route: "api/admin/import" });

interface CsvRow {
  position: number;
  email: string;
  name: string;
  phone: string;
  joined_at: string;
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  return fields;
}

function parseCsv(csvContent: string): CsvRow[] {
  const lines = csvContent.trim().split("\n");
  if (lines.length < 2) return [];

  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCsvLine(lines[i]);
    if (fields.length >= 5) {
      const email = fields[1].replace(/^"|"$/g, "").trim().toLowerCase();
      if (email && email.includes("@")) {
        rows.push({
          position: parseInt(fields[0].replace(/^"|"$/g, ""), 10) || i,
          email,
          name: fields[2].replace(/^"|"$/g, "").trim() || "Unknown",
          phone: fields[3].replace(/^"|"$/g, "").trim() || "",
          joined_at: fields[4].replace(/^"|"$/g, "").trim(),
        });
      }
    }
  }
  return rows;
}

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    log.info("CSV import request started");

    const contentType = request.headers.get("content-type") || "";

    let csvContent: string;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return apiError("VALIDATION_ERROR", "No CSV file provided", 400);
      }
      csvContent = await file.text();
    } else {
      const body = await request.json();
      csvContent = body.csv_content;
      if (!csvContent) {
        return apiError("VALIDATION_ERROR", "No CSV content provided", 400);
      }
    }

    const rows = parseCsv(csvContent);
    log.info({ rowCount: rows.length }, "Parsed CSV rows");

    if (rows.length === 0) {
      return apiError("VALIDATION_ERROR", "No valid rows found in CSV", 400);
    }

    // Get existing emails to skip duplicates
    const { data: existingUsers } = await supabaseAdmin
      .from("waitlist_users")
      .select("email");

    const existingEmails = new Set(
      (existingUsers || []).map((u) => u.email.toLowerCase())
    );

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const row of rows) {
      if (existingEmails.has(row.email)) {
        skipped++;
        continue;
      }

      try {
        const referralCode = await generateUniqueReferralCode();
        const { error } = await supabaseAdmin
          .from("waitlist_users")
          .insert({
            full_name: row.name || "Unknown",
            email: row.email,
            whatsapp_number: row.phone || "",
            referral_code: referralCode,
            position: row.position,
            source: "csv_import",
          });

        if (error) {
          errors.push(`${row.email}: ${error.message}`);
        } else {
          imported++;
          existingEmails.add(row.email);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        errors.push(`${row.email}: ${message}`);
      }
    }

    log.info({ imported, skipped, errors: errors.length }, "CSV import completed");

    return apiSuccess({
      success: true,
      imported,
      skipped,
      total: rows.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  });
}
