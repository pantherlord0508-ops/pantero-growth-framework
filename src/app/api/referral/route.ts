import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { success: false, error: "Missing code parameter" },
      { status: 400 }
    );
  }

  const { data: user } = await supabaseAdmin
    .from("waitlist_users")
    .select("full_name, referral_count, position")
    .eq("referral_code", code)
    .single();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Referral code not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    user: {
      full_name: user.full_name,
      referral_count: user.referral_count,
      position: user.position,
    },
  });
}
