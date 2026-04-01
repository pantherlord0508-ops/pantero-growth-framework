import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { subject, body, filter } = await request.json();

    if (!subject || !body) {
      return NextResponse.json(
        { success: false, error: "Subject and body are required" },
        { status: 400 }
      );
    }

    if (typeof subject !== "string" || typeof body !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid input types" },
        { status: 400 }
      );
    }

    if (subject.length > 200 || body.length > 50000) {
      return NextResponse.json(
        { success: false, error: "Input too long" },
        { status: 400 }
      );
    }

    let query = supabaseAdmin
      .from("waitlist_users")
      .select("email, full_name");

    if (filter && typeof filter === "object") {
      if (filter.min_referrals !== undefined && typeof filter.min_referrals === "number") {
        query = query.gte("referral_count", filter.min_referrals);
      }
      if (filter.max_referrals !== undefined && typeof filter.max_referrals === "number") {
        query = query.lte("referral_count", filter.max_referrals);
      }
    }

    const { data: users, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch recipients" },
        { status: 500 }
      );
    }

    if (!users || users.length === 0) {
      return NextResponse.json({
        success: true,
        sent_count: 0,
      });
    }

    const { sendBulkEmail } = await import("@/lib/email");
    const recipients = users.map((u) => ({ email: u.email, name: u.full_name }));
    await sendBulkEmail(subject, body, recipients);

    return NextResponse.json({
      success: true,
      sent_count: recipients.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
