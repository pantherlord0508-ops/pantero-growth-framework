import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { apiSuccess, apiError, withErrorHandling } from "@/lib/api-response";
import { createLogger } from "@/lib/logger";
import { generateUniqueReferralCode } from "@/lib/services/waitlist";

const log = createLogger({ route: "api/admin/import" });

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    log.info("CSV import request started");

    const contentType = request.headers.get("content-type") || "";
    let csvContent: string;
    let filename = "import.csv";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return apiError("VALIDATION_ERROR", "No CSV file provided", 400);
      }
      filename = file.name;
      csvContent = await file.text();
    } else {
      const body = await request.json();
      csvContent = body.csv_content;
      if (!csvContent) {
        return apiError("VALIDATION_ERROR", "No CSV content provided", 400);
      }
    }

    // Store CSV file to Supabase Storage
    const timestamp = Date.now();
    const storageKey = `csv_imports/${timestamp}-${filename}`;
    
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("csv-files")
      .upload(storageKey, csvContent, {
        contentType: "text/csv",
        upsert: true,
      });

    if (uploadError) {
      log.warn({ err: uploadError }, "Failed to upload CSV to storage, continuing with import only");
    } else {
      log.info({ storageKey: uploadData?.path }, "CSV uploaded to Supabase Storage");
    }

    // Parse CSV
    const lines = csvContent.trim().split("\n");
    if (lines.length < 2) {
      return apiError("VALIDATION_ERROR", "CSV file is empty or has no data rows", 400);
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

    // Parse and import each row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Simple CSV parsing
      const fields = line.split(",").map(f => f.replace(/^"|"$/g, "").trim());
      
      if (fields.length < 2) continue;

      const email = fields[1]?.toLowerCase();
      if (!email || !email.includes("@")) {
        errors.push(`Row ${i}: Invalid email`);
        continue;
      }

      if (existingEmails.has(email)) {
        skipped++;
        continue;
      }

      try {
        const referralCode = await generateUniqueReferralCode();
        const fullName = fields[2]?.trim() || "Unknown";
        const whatsappNumber = fields[3]?.trim() || "";
        const position = parseInt(fields[0], 10) || (i);

        const { error } = await supabaseAdmin
          .from("waitlist_users")
          .insert({
            full_name: fullName,
            email: email,
            whatsapp_number: whatsappNumber,
            referral_code: referralCode,
            position: position,
            source: "csv_import",
          });

        if (error) {
          errors.push(`${email}: ${error.message}`);
        } else {
          imported++;
          existingEmails.add(email);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        errors.push(`${email}: ${msg}`);
      }
    }

    log.info({ imported, skipped, errors: errors.length }, "CSV import completed");

    return apiSuccess({
      success: true,
      imported,
      skipped,
      total: lines.length - 1,
      errors: errors.length > 0 ? errors : undefined,
      storageKey: uploadData?.path || null,
    });
  });
}

export async function GET() {
  return withErrorHandling(async () => {
    // Check Supabase connection and return status
    const { data: tableCount, error: tableError } = await supabaseAdmin
      .from("waitlist_users")
      .select("*", { count: "exact", head: true });

    const { data: storageBuckets } = await supabaseAdmin.storage.listBuckets();

    return apiSuccess({
      status: "ok",
      database_connected: !tableError,
      total_users: tableCount || 0,
      storage_buckets: storageBuckets?.map(b => b.name) || [],
    });
  });
}
