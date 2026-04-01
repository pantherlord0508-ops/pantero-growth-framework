import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { count: totalCount } = await supabaseAdmin
    .from("waitlist_users")
    .select("*", { count: "exact", head: true });

  const { count: todayCount } = await supabaseAdmin
    .from("waitlist_users")
    .select("*", { count: "exact", head: true })
    .gte("joined_at", todayStart);

  const { count: weekCount } = await supabaseAdmin
    .from("waitlist_users")
    .select("*", { count: "exact", head: true })
    .gte("joined_at", weekStart);

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

  const { data: recentSignups } = await supabaseAdmin
    .from("waitlist_users")
    .select("full_name, joined_at")
    .order("joined_at", { ascending: false })
    .limit(10);

  const anonymized = (recentSignups || []).map((u) => ({
    name: u.full_name.split(" ")[0],
    time: u.joined_at,
  }));

  return NextResponse.json({
    total_signups: totalCount || 0,
    signups_today: todayCount || 0,
    signups_this_week: weekCount || 0,
    daily_trend: Object.entries(dailyTrend)
      .map(([date, count]) => ({ date, count }))
      .reverse(),
    source_breakdown: sourceBreakdown,
    recent_signups: anonymized,
  });
}
