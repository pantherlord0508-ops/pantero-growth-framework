import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { bulkEmailSchema } from "@/lib/schemas";
import { apiSuccess, handleZodError, withErrorHandling } from "@/lib/api-response";
import { createLogger } from "@/lib/logger";

const log = createLogger({ route: "api/admin/email" });

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const body = await request.json();
    const parsed = bulkEmailSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const { subject, body: emailBody, filter } = parsed.data;

    log.info({ subject, hasFilter: !!filter }, "Bulk email request started");

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

    const { sendBulkEmail } = await import("@/lib/email");
    const recipients = users.map((u) => ({ email: u.email, name: u.full_name }));
    await sendBulkEmail(subject, emailBody, recipients);

    log.info({ recipientCount: recipients.length }, "Bulk email sent");

    return apiSuccess({
      success: true,
      sent_count: recipients.length,
    });
  });
}
