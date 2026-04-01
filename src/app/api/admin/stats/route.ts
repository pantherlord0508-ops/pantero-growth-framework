import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createLogger } from "@/lib/logger";
import { withErrorHandling } from "@/lib/api-response";

const log = createLogger({ route: "api/admin/stats" });

export async function GET() {
  return withErrorHandling(async () => {
    log.info("Admin stats request started");
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { count: totalUsers } = await supabaseAdmin
      .from("waitlist_users")
      .select("*", { count: "exact", head: true });

    const { count: signupsToday } = await supabaseAdmin
      .from("waitlist_users")
      .select("*", { count: "exact", head: true })
      .gte("joined_at", todayStart);

    const { count: signupsWeek } = await supabaseAdmin
      .from("waitlist_users")
      .select("*", { count: "exact", head: true })
      .gte("joined_at", weekStart);

    const { count: signupsMonth } = await supabaseAdmin
      .from("waitlist_users")
      .select("*", { count: "exact", head: true })
      .gte("joined_at", monthStart);

    const { count: totalReferrals } = await supabaseAdmin
      .from("referrals")
      .select("*", { count: "exact", head: true });

    const { data: topReferrers } = await supabaseAdmin
      .from("waitlist_users")
      .select("full_name, email, referral_count, referral_code")
      .gt("referral_count", 0)
      .order("referral_count", { ascending: false })
      .limit(10);

    const { data: sourceData } = await supabaseAdmin
      .from("waitlist_users")
      .select("source");

    const sourceBreakdown: Record<string, number> = {};
    if (sourceData) {
      for (const row of sourceData) {
        const src = row.source || "unknown";
        sourceBreakdown[src] = (sourceBreakdown[src] || 0) + 1;
      }
    }

    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentUsers } = await supabaseAdmin
      .from("waitlist_users")
      .select("joined_at")
      .gte("joined_at", thirtyDaysAgo)
      .order("joined_at", { ascending: true });

    const dailyTrend: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = date.toISOString().split("T")[0];
      dailyTrend[key] = 0;
    }

    if (recentUsers) {
      for (const user of recentUsers) {
        const date = user.joined_at.split("T")[0];
        if (dailyTrend[date] !== undefined) {
          dailyTrend[date]++;
        }
      }
    }

    log.info({ totalUsers, signupsToday, signupsWeek, signupsMonth }, "Admin stats request completed");

    return NextResponse.json({
      total_users: totalUsers || 0,
      signups_today: signupsToday || 0,
      signups_week: signupsWeek || 0,
      signups_month: signupsMonth || 0,
      total_referrals: totalReferrals || 0,
      top_referrers: topReferrers || [],
      source_breakdown: sourceBreakdown,
      daily_trend: Object.entries(dailyTrend)
        .map(([date, count]) => ({ date, count }))
        .reverse(),
    });
  });
}
