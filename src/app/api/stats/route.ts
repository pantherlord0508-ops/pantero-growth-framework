import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cmqzshcmwgkjsciuvztc.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

function getDailyTrend(users: { joined_at: string }[]): { date: string; count: number }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const last30Days: { date: string; count: number }[] = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    last30Days.push({ date: dateStr, count: 0 });
  }
  
  users.forEach((user) => {
    if (!user.joined_at) return;
    const joinDate = new Date(user.joined_at).toISOString().split("T")[0];
    const day = last30Days.find((d) => d.date === joinDate);
    if (day) day.count++;
  });
  
  return last30Days;
}

function getSignupsToday(users: { joined_at: string }[]): number {
  const today = new Date().toISOString().split("T")[0];
  return users.filter((u) => u.joined_at?.startsWith(today)).length;
}

function getSignupsThisWeek(users: { joined_at: string }[]): number {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return users.filter((u) => u.joined_at && new Date(u.joined_at) >= weekAgo).length;
}

export async function GET() {
  try {
    const { data: allUsers, error: allError } = await supabaseAdmin
      .from("waitlist_users")
      .select("id, joined_at")
      .limit(1000);
    
    if (allError) {
      return NextResponse.json({
        success: false,
        error: allError.message,
        code: "STATS_ERROR"
      }, { status: 500 });
    }

    const totalCount = allUsers?.length || 0;
    const users = allUsers || [];

    const { data: recentSignups, error: recentError } = await supabaseAdmin
      .from("waitlist_users")
      .select("full_name, joined_at")
      .order("joined_at", { ascending: false })
      .limit(10);

    if (recentError) {
      return NextResponse.json({
        success: false,
        error: recentError.message,
        code: "RECENT_ERROR"
      }, { status: 500 });
    }

    const anonymized = (recentSignups || []).map((u) => ({
      name: u.full_name?.split(" ")[0] || "Anonymous",
      time: u.joined_at,
    }));

    const dailyTrend = getDailyTrend(users);
    const signupsToday = getSignupsToday(users);
    const signupsThisWeek = getSignupsThisWeek(users);

    return NextResponse.json({
      total_signups: totalCount,
      signups_today: signupsToday,
      signups_this_week: signupsThisWeek,
      daily_trend: dailyTrend,
      source_breakdown: {},
      recent_signups: anonymized,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({
      success: false,
      error: message,
      code: "UNEXPECTED_ERROR"
    }, { status: 500 });
  }
}
