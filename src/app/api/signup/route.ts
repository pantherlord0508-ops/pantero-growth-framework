import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";

const signupSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  whatsapp_number: z.string().min(7, "WhatsApp number must be at least 7 characters"),
  how_heard: z.string().optional(),
  company_role: z.string().optional(),
  referral_code: z.string().optional(),
});

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function dispatchWelcomeEmail(email: string, full_name: string, referral_code: string, position: number) {
  try {
    const { sendWelcomeEmail: send } = await import("@/lib/email");
    await send({ full_name, email, referral_code, position });
  } catch {
    // Silently ignore email failures
  }
}

async function recalculatePositions() {
  const { data: users } = await supabaseAdmin
    .from("waitlist_users")
    .select("id, referral_count")
    .order("referral_count", { ascending: false })
    .order("joined_at", { ascending: true });

  if (!users) return;

  const updates = users.map((user, index) =>
    supabaseAdmin
      .from("waitlist_users")
      .update({ position: index + 1 })
      .eq("id", user.id)
  );

  await Promise.all(updates);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { full_name, email, whatsapp_number, how_heard, company_role, referral_code } = parsed.data;

    const { data: existing } = await supabaseAdmin
      .from("waitlist_users")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 }
      );
    }

    let uniqueCode = generateReferralCode();
    let codeExists = true;
    while (codeExists) {
      const { data } = await supabaseAdmin
        .from("waitlist_users")
        .select("id")
        .eq("referral_code", uniqueCode)
        .single();
      if (!data) {
        codeExists = false;
      } else {
        uniqueCode = generateReferralCode();
      }
    }

    const { count } = await supabaseAdmin
      .from("waitlist_users")
      .select("*", { count: "exact", head: true });

    const nextPosition = (count || 0) + 1;

    let referredBy: string | null = null;
    if (referral_code) {
      const { data: referrer } = await supabaseAdmin
        .from("waitlist_users")
        .select("id")
        .eq("referral_code", referral_code)
        .single();
      if (referrer) {
        referredBy = referrer.id;
      }
    }

    const { data: newUser, error: insertError } = await supabaseAdmin
      .from("waitlist_users")
      .insert({
        full_name,
        email,
        whatsapp_number,
        referral_code: uniqueCode,
        referred_by: referredBy,
        position: nextPosition,
        how_heard: how_heard || null,
        company_role: company_role || null,
        source: "web",
      })
      .select("id, referral_code, position")
      .single();

    if (insertError || !newUser) {
      return NextResponse.json(
        { success: false, error: "Failed to create account" },
        { status: 500 }
      );
    }

    if (referredBy) {
      await supabaseAdmin.from("referrals").insert({
        referrer_id: referredBy,
        referee_id: newUser.id,
      });

      const { data: referrer } = await supabaseAdmin
        .from("waitlist_users")
        .select("referral_count")
        .eq("id", referredBy)
        .single();

      if (referrer) {
        await supabaseAdmin
          .from("waitlist_users")
          .update({ referral_count: referrer.referral_count + 1 })
          .eq("id", referredBy);
      }

      await recalculatePositions();
    }

    // Fire and forget welcome email
    dispatchWelcomeEmail(email, full_name, uniqueCode, newUser.position);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        referral_code: newUser.referral_code,
        position: newUser.position,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
