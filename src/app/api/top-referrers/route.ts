import { supabaseAdmin } from "@/lib/supabase";
import { createLogger } from "@/lib/logger";
import { apiSuccess, withErrorHandling } from "@/lib/api-response";

const log = createLogger({ route: "api/top-referrers" });

export async function GET() {
  return withErrorHandling(async () => {
    log.info("Top referrers request");

    const { data: topReferrers, error } = await supabaseAdmin
      .from("waitlist_users")
      .select("full_name, email, referral_count, referral_code")
      .gt("referral_count", 0)
      .order("referral_count", { ascending: false })
      .limit(10);

    if (error) {
      log.error({ err: error }, "Failed to fetch top referrers");
      throw error;
    }

    return apiSuccess({ top_referrers: topReferrers || [] });
  });
}
