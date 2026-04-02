import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { bulkEmailSchema } from "@/lib/schemas";
import { apiSuccess, apiError, handleZodError, withErrorHandling } from "@/lib/api-response";
import { createLogger } from "@/lib/logger";

const log = createLogger({ route: "api/admin/email" });

// In-memory lock to prevent concurrent bulk email sends
let isSendingBulkEmail = false;
let lastSendTimestamp = 0;
const MIN_SEND_INTERVAL_MS = 60_000; // 1 minute cooldown between sends

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    // Check if a bulk email send is already in progress
    if (isSendingBulkEmail) {
      return apiError(
        "SEND_IN_PROGRESS",
        "A bulk email send is already in progress. Please wait.",
        429
      );
    }

    // Check minimum interval between sends
    const now = Date.now();
    if (now - lastSendTimestamp < MIN_SEND_INTERVAL_MS) {
      const remainingSecs = Math.ceil(
        (MIN_SEND_INTERVAL_MS - (now - lastSendTimestamp)) / 1000
      );
      return apiError(
        "RATE_LIMITED",
        `Please wait ${remainingSecs} seconds before sending another bulk email.`,
        429
      );
    }

    const body = await request.json();
    const parsed = bulkEmailSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const { subject, body: emailBody, filter } = parsed.data;

    // Generate idempotency key based on subject + body hash
    const idempotencyKey = `${subject}:${emailBody.length}:${now}`;

    // Check if this exact email was recently sent (within last 5 minutes)
    const { data: recentSend } = await supabaseAdmin
      .from("admin_settings")
      .select("setting_value")
      .eq("setting_key", "last_bulk_email")
      .maybeSingle();

    if (recentSend?.setting_value) {
      try {
        const lastSend = JSON.parse(recentSend.setting_value);
        if (
          lastSend.subject === subject &&
          lastSend.bodyLength === emailBody.length &&
          now - lastSend.timestamp < 5 * 60 * 1000
        ) {
          return apiError(
            "DUPLICATE_EMAIL",
            "This email was already sent recently. Please wait before sending again.",
            409
          );
        }
      } catch {
        // Ignore parse errors from old format
      }
    }

    log.info({ subject, hasFilter: !!filter }, "Bulk email request started");

    isSendingBulkEmail = true;

    try {
      let query = supabaseAdmin
        .from("waitlist_users")
        .select("email, full_name");

      if (filter) {
        if (filter.min_referrals !== undefined) {
          query = query.gte("referral_count", filter.min_referrals);
        }
        if (filter.max_referrals !== undefined) {
          query = query.lte("referral_count", filter.max_referrals);
        }
      }

      const { data: users, error } = await query;

      if (error) {
        log.error({ err: error }, "Failed to fetch recipients");
        throw error;
      }

      if (!users || users.length === 0) {
        log.info("No recipients found for bulk email");
        return apiSuccess({ success: true, sent_count: 0 });
      }

      // Deduplicate recipients by email
      const uniqueRecipients = Array.from(
        new Map(users.map((u) => [u.email.toLowerCase(), u])).values()
      );

      const { sendBulkEmail } = await import("@/lib/email");
      const recipients = uniqueRecipients.map((u) => ({
        email: u.email,
        name: u.full_name,
      }));

      const result = await sendBulkEmail(subject, emailBody, recipients);

      // Record this send to prevent duplicates
      await supabaseAdmin
        .from("admin_settings")
        .upsert(
          {
            setting_key: "last_bulk_email",
            setting_value: JSON.stringify({
              subject,
              bodyLength: emailBody.length,
              timestamp: now,
              recipientCount: recipients.length,
              idempotencyKey,
            }),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "setting_key" }
        );

      lastSendTimestamp = now;

      log.info(
        { recipientCount: recipients.length, sent: result.sent, failed: result.failed },
        "Bulk email sent"
      );

      return apiSuccess({
        success: true,
        sent_count: result.sent,
        failed_count: result.failed,
        errors: result.errors.length > 0 ? result.errors : undefined,
      });
    } finally {
      isSendingBulkEmail = false;
    }
  });
}
