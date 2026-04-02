import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cmqzshcmwgkjsciuvztc.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, body: emailBody, filter } = body;

    if (!subject || !emailBody) {
      return NextResponse.json({
        success: false,
        error: "Subject and body are required"
      }, { status: 400 });
    }

    // Fetch users
    let query = supabaseAdmin
      .from("waitlist_users")
      .select("email, full_name");

    if (filter?.min_referrals) {
      query = query.gte("referral_count", filter.min_referrals);
    }
    if (filter?.max_referrals) {
      query = query.lte("referral_count", filter.max_referrals);
    }

    const { data: users, error } = await query;

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    if (!users || users.length === 0) {
      return NextResponse.json({
        success: true,
        sent_count: 0,
        message: "No recipients found"
      });
    }

    // Check if Resend is configured
    if (!resend || !resendApiKey) {
      return NextResponse.json({
        success: false,
        error: "Email service not configured. Check RESEND_API_KEY."
      }, { status: 500 });
    }

    // Send emails
    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    // Send to all users
    for (const user of users) {
      try {
        await resend.emails.send({
          from: "Pantero <onboarding@resend.dev>",
          to: user.email,
          subject: subject,
          html: `<p>Hi ${user.full_name || 'there'},</p>${emailBody}`,
        });
        sent++;
      } catch (err) {
        failed++;
        errors.push(`${user.email}: ${err instanceof Error ? err.message : 'Failed'}`);
      }
    }

    return NextResponse.json({
      success: true,
      sent_count: sent,
      failed_count: failed,
      total_recipients: users.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({
      success: false,
      error: message
    }, { status: 500 });
  }
}
