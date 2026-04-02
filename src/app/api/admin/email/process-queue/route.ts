import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cmqzshcmwgkjsciuvztc.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

const resendApiKey = process.env.RESEND_API_KEY;
const DAILY_LIMIT = 75;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.CRON_SECRET || "pantero-cron-secret";
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!resendApiKey) {
      return NextResponse.json({
        success: false,
        error: "RESEND_API_KEY not configured"
      }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);
    const today = new Date().toISOString().split("T")[0];

    const { data: sentToday } = await supabaseAdmin
      .from("email_campaigns")
      .select("recipient_email", { count: "exact" })
      .eq("status", "sent")
      .gte("sent_at", today);

    const sentCount = sentToday?.length || 0;
    const remainingSlots = Math.max(0, DAILY_LIMIT - sentCount);

    if (remainingSlots === 0) {
      return NextResponse.json({
        success: true,
        message: "Daily limit reached",
        sent_today: sentCount,
        remaining_today: 0
      });
    }

    const { data: pendingEmails, error: fetchError } = await supabaseAdmin
      .from("email_campaigns")
      .select("id, campaign_id, recipient_email, recipient_name, subject, body")
      .eq("status", "pending")
      .lte("scheduled_for", new Date().toISOString())
      .order("sent_at", { ascending: true })
      .limit(remainingSlots);

    if (fetchError) {
      return NextResponse.json({
        success: false,
        error: `Database error: ${fetchError.message}`
      }, { status: 500 });
    }

    if (!pendingEmails || pendingEmails.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No pending emails to process",
        processed: 0
      });
    }

    let processed = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const email of pendingEmails) {
      try {
        const result = await resend.emails.send({
          from: "Pantero Nexus <onboarding@resend.dev>",
          to: email.recipient_email,
          subject: email.subject,
          html: `<p>Hi ${email.recipient_name || 'there'},</p>${email.body}`,
        });

        if (result.error) {
          await supabaseAdmin
            .from("email_campaigns")
            .update({ status: "failed", error_message: result.error.message, sent_at: new Date().toISOString() })
            .eq("id", email.id);
          failed++;
          errors.push(`${email.recipient_email}: ${result.error.message}`);
        } else {
          await supabaseAdmin
            .from("email_campaigns")
            .update({ status: "sent", sent_at: new Date().toISOString() })
            .eq("id", email.id);
          processed++;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        await supabaseAdmin
          .from("email_campaigns")
          .update({ status: "failed", error_message: errorMsg, sent_at: new Date().toISOString() })
          .eq("id", email.id);
        failed++;
        errors.push(`${email.recipient_email}: ${errorMsg}`);
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      failed,
      sent_today: sentCount + processed,
      remaining_today: DAILY_LIMIT - (sentCount + processed),
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