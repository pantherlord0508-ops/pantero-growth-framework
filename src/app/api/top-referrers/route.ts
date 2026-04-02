import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cmqzshcmwgkjsciuvztc.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data: topReferrers, error } = await supabaseAdmin
      .from("waitlist_users")
      .select("full_name, email, referral_count, referral_code")
      .gt("referral_count", 0)
      .order("referral_count", { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      top_referrers: topReferrers || []
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : "Unknown error"
    }, { status: 500 });
  }
}