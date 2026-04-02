import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cmqzshcmwgkjsciuvztc.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Get total users (simple query)
    const { data: allUsers, error: countError } = await supabaseAdmin
      .from("waitlist_users")
      .select("id")
      .limit(5000);

    if (countError) {
      return NextResponse.json({
        success: false,
        error: countError.message
      }, { status: 500 });
    }

    const totalUsers = allUsers?.length || 0;

    // Get top referrers
    const { data: topReferrers, error: referrersError } = await supabaseAdmin
      .from("waitlist_users")
      .select("full_name, email, referral_count")
      .gt("referral_count", 0)
      .order("referral_count", { ascending: false })
      .limit(10);

    if (referrersError) {
      return NextResponse.json({
        success: false,
        error: referrersError.message
      }, { status: 500 });
    }

    // Get source breakdown
    const { data: sourceData, error: sourceError } = await supabaseAdmin
      .from("waitlist_users")
      .select("source");

    if (sourceError) {
      return NextResponse.json({
        success: false,
        error: sourceError.message
      }, { status: 500 });
    }

    const sourceBreakdown: Record<string, number> = {};
    if (sourceData) {
      for (const row of sourceData) {
        const src = row.source || "unknown";
        sourceBreakdown[src] = (sourceBreakdown[src] || 0) + 1;
      }
    }

    return NextResponse.json({
      success: true,
      total_users: totalUsers,
      signups_today: 0,
      signups_week: 0,
      signups_month: 0,
      total_referrals: 0,
      top_referrers: topReferrers || [],
      source_breakdown: sourceBreakdown,
      daily_trend: []
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({
      success: false,
      error: message
    }, { status: 500 });
  }
}
