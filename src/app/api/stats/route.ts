import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cmqzshcmwgkjsciuvztc.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Get total count
    const { data: allUsers, error: allError } = await supabaseAdmin
      .from("waitlist_users")
      .select("id")
      .limit(1000);
    
    if (allError) {
      return NextResponse.json({
        success: false,
        error: allError.message,
        code: "STATS_ERROR"
      }, { status: 500 });
    }

    const totalCount = allUsers?.length || 0;

    // Get recent signups
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

    return NextResponse.json({
      total_signups: totalCount,
      signups_today: 0,
      signups_this_week: 0,
      daily_trend: [],
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
