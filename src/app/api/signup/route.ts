import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cmqzshcmwgkjsciuvztc.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { full_name, email, whatsapp_number, how_heard, company_role, referral_code } = body;

    // Validate required fields
    if (!full_name || full_name.length < 2) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Valid email is required" }, { status: 400 });
    }
    if (!whatsapp_number) {
      return NextResponse.json({ success: false, error: "WhatsApp number is required" }, { status: 400 });
    }

    // Check if email exists
    const { data: existing } = await supabaseAdmin
      .from("waitlist_users")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: false, error: "Email already registered" }, { status: 409 });
    }

    // Get next position
    const { data: lastUser } = await supabaseAdmin
      .from("waitlist_users")
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();

    const position = (lastUser?.position || 0) + 1;
    const referralCode = generateReferralCode();

    // Create user
    const { data, error } = await supabaseAdmin
      .from("waitlist_users")
      .insert({
        full_name,
        email: email.toLowerCase(),
        whatsapp_number,
        referral_code: referralCode,
        position,
        how_heard: how_heard || null,
        company_role: company_role || null,
        source: "web",
      })
      .select("id, referral_code, position")
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message || "Failed to create user"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.id,
        referral_code: data.referral_code,
        position: data.position,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
