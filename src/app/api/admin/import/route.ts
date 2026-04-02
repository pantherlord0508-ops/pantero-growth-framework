import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cmqzshcmwgkjsciuvztc.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

interface CsvRow {
  position: number;
  email: string;
  name: string;
  phone: string;
  joined_at: string;
}

function generateReferralCode(length = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
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

export async function POST(request: NextRequest) {
  try {
    let csvContent: string;
    let filename = "waitlist_sign_ups.csv";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({
          success: false,
          error: "No CSV file provided"
        }, { status: 400 });
      }
      filename = file.name;
      csvContent = await file.text();
    } else {
      const body = await request.json();
      csvContent = body.csv_content;
      if (!csvContent) {
        return NextResponse.json({
          success: false,
          error: "No CSV content provided"
        }, { status: 400 });
      }
    }

    const rows = parseCsv(csvContent);

    if (rows.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No valid rows found in CSV"
      }, { status: 400 });
    }

    const { data: existingUsers } = await supabaseAdmin
      .from("waitlist_users")
      .select("email");

    const existingEmails = new Set(
      (existingUsers || []).map((u) => u.email.toLowerCase())
    );

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

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
          const referralCode = generateReferralCode();
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
          errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`);
        } else {
          imported += inserts.length;
        }
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      skipped,
      total: rows.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({
      success: false,
      error: message
    }, { status: 500 });
  }
}