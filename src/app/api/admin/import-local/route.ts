import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createLogger } from "@/lib/logger";
import { generateUniqueReferralCode } from "@/lib/services/waitlist";
import * as fs from "fs";
import * as path from "path";

const log = createLogger({ route: "api/admin/import-local" });

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
    if (fields.length >= 2) {
      const email = fields[1]?.replace(/^"|"$/g, "").trim().toLowerCase() || "";
      if (email && email.includes("@")) {
        rows.push({
          position: parseInt(fields[0]?.replace(/^"|"$/g, ""), 10) || i,
          email,
          name: fields[2]?.replace(/^"|"$/g, "").trim() || "Unknown",
          phone: fields[3]?.replace(/^"|"$/g, "").trim() || "",
          joined_at: fields[4]?.replace(/^"|"$/g, "").trim() || "",
        });
      }
    }
  }
  return rows;
}

export async function POST() {
  const csvPaths = [
    path.join(process.cwd(), "waitlist_sign_ups.csv"),
    path.join(process.cwd(), "waitlist_sign_ups (1).csv"),
  ];

  let csvContent = "";
  let usedFile = "";

  for (const csvPath of csvPaths) {
    try {
      if (fs.existsSync(csvPath)) {
        csvContent = fs.readFileSync(csvPath, "utf-8");
        usedFile = csvPath;
        break;
      }
    } catch {
      continue;
    }
  }

  if (!csvContent) {
    return NextResponse.json(
      { success: false, error: "No CSV file found" },
      { status: 404 }
    );
  }

  log.info({ file: usedFile }, "Reading CSV file");

  const rows = parseCsv(csvContent);
  log.info({ rowCount: rows.length }, "Parsed CSV rows");

  if (rows.length === 0) {
    return NextResponse.json(
      { success: false, error: "No valid rows found in CSV" },
      { status: 400 }
    );
  }

  // Get existing emails to skip duplicates
  const { data: existingUsers } = await supabaseAdmin
    .from("waitlist_users")
    .select("email");

  const existingEmails = new Set(
    (existingUsers || []).map((u) => u.email.toLowerCase())
  );

  log.info({ existingCount: existingEmails.size }, "Existing users");

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  // Process in batches
  const BATCH_SIZE = 50;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const inserts = [];

    for (const row of batch) {
      if (existingEmails.has(row.email)) {
        skipped++;
        continue;
      }

      try {
        const referralCode = await generateUniqueReferralCode();
        inserts.push({
          full_name: row.name || "Unknown",
          email: row.email,
          whatsapp_number: row.phone || "",
          referral_code: referralCode,
          position: row.position,
          joined_at: new Date().toISOString(),
          source: "csv_import",
        });
        existingEmails.add(row.email);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        errors.push(`${row.email}: ${msg}`);
      }
    }

    if (inserts.length > 0) {
      const { error } = await supabaseAdmin
        .from("waitlist_users")
        .insert(inserts);

      if (error) {
        errors.push(`Batch error: ${error.message}`);
      } else {
        imported += inserts.length;
      }
    }
  }

  log.info({ imported, skipped, errors: errors.length }, "Import completed");

  return NextResponse.json({
    success: true,
    imported,
    skipped,
    total: rows.length,
    errors: errors.length > 0 ? errors : undefined,
    file: usedFile,
  });
}
