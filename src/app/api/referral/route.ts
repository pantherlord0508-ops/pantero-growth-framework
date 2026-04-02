import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cmqzshcmwgkjsciuvztc.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.json({
        success: false,
        error: "Referral code is required"
      }, { status: 400 });
    }

    const { data: user } = await supabaseAdmin
      .from("waitlist_users")
      .select("full_name, referral_count, position")
      .eq("referral_code", code)
      .maybeSingle();

    if (!user) {
      return NextResponse.json({
        success: false,
        error: "Referral code not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        full_name: user.full_name,
        referral_count: user.referral_count,
        position: user.position,
      },
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : "Unknown error"
    }, { status: 500 });
  }
}