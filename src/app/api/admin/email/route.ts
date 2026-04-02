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
    if (!resendApiKey) {
      return NextResponse.json({
        success: false,
        error: "RESEND_API_KEY not configured"
      }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);
    const contentType = request.headers.get("content-type") || "";

    let subject: string;
    let emailBody: string;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      subject = formData.get("subject") as string;
      emailBody = formData.get("body") as string;
    } else {
      const jsonBody = await request.json();
      subject = jsonBody.subject;
      emailBody = jsonBody.body;
    }

    if (!subject || !emailBody) {
      return NextResponse.json({
        success: false,
        error: "Subject and body are required"
      }, { status: 400 });
    }

    const { data: allUsers, error } = await supabaseAdmin
      .from("waitlist_users")
      .select("email, full_name");

    if (error) {
      return NextResponse.json({
        success: false,
        error: `Database error: ${error.message}`
      }, { status: 500 });
    }

    if (!allUsers || allUsers.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No users found"
      }, { status: 400 });
    }

    const campaignId = crypto.randomUUID();
    const today = new Date().toISOString().split("T")[0];

    const { data: existingSent } = await supabaseAdmin
      .from("email_campaigns")
      .select("recipient_email")
      .eq("status", "sent")
      .gte("sent_at", today);

    const sentEmailsToday = new Set(existingSent?.map(e => e.recipient_email) || []);
    
    const { data: alreadySentInCampaign } = await supabaseAdmin
      .from("email_campaigns")
      .select("recipient_email")
      .eq("campaign_id", campaignId)
      .eq("status", "sent");

    const sentInCampaign = new Set(alreadySentInCampaign?.map(e => e.recipient_email) || []);

    const usersToProcess = allUsers.filter(u => 
      !sentEmailsToday.has(u.email) && !sentInCampaign.has(u.email)
    );

    const usersToSendNow = usersToProcess.slice(0, DAILY_LIMIT);
    const remainingUsers = usersToProcess.slice(DAILY_LIMIT);

    let sentNow = 0;
    let failedNow = 0;
    const errors: string[] = [];

    for (const user of usersToSendNow) {
      try {
        const result = await resend.emails.send({
          from: "Pantero Nexus <onboarding@resend.dev>",
          to: user.email,
          subject: subject,
          html: `<p>Hi ${user.full_name || 'there'},</p>${emailBody}`,
        });

        if (result.error) {
          await supabaseAdmin.from("email_campaigns").insert({
            campaign_id: campaignId,
            recipient_email: user.email,
            recipient_name: user.full_name,
            subject: subject,
            body: emailBody,
            status: "failed",
            error_message: result.error.message,
            sent_at: new Date().toISOString(),
          });
          failedNow++;
          errors.push(`${user.email}: ${result.error.message}`);
        } else {
          await supabaseAdmin.from("email_campaigns").insert({
            campaign_id: campaignId,
            recipient_email: user.email,
            recipient_name: user.full_name,
            subject: subject,
            body: emailBody,
            status: "sent",
            sent_at: new Date().toISOString(),
          });
          sentNow++;
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        await supabaseAdmin.from("email_campaigns").insert({
          campaign_id: campaignId,
          recipient_email: user.email,
          recipient_name: user.full_name,
          subject: subject,
          body: emailBody,
          status: "failed",
          error_message: errorMsg,
          sent_at: new Date().toISOString(),
        });
        failedNow++;
        errors.push(`${user.email}: ${errorMsg}`);
      }
    }

    const queuedCount = remainingUsers.length;
    if (queuedCount > 0) {
      for (const user of remainingUsers) {
        await supabaseAdmin.from("email_campaigns").insert({
          campaign_id: campaignId,
          recipient_email: user.email,
          recipient_name: user.full_name,
          subject: subject,
          body: emailBody,
          status: "pending",
          scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      campaign_id: campaignId,
      sent_now: sentNow,
      failed_now: failedNow,
      queued: queuedCount,
      total_recipients: allUsers.length,
      daily_limit: DAILY_LIMIT,
      remaining_today: Math.max(0, DAILY_LIMIT - sentNow),
      next_batch: queuedCount > 0 ? "Tomorrow at midnight (or run process-queue)" : null,
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

export async function GET() {
  try {
    const { data: campaigns, error } = await supabaseAdmin
      .from("email_campaigns")
      .select("campaign_id, subject, status, sent_at, error_message")
      .order("sent_at", { ascending: false });

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    const campaignMap: Record<string, {
      campaign_id: string;
      subject: string;
      sent: number;
      failed: number;
      pending: number;
      last_sent: string | null;
      status: string;
    }> = {};

    for (const row of campaigns || []) {
      if (!campaignMap[row.campaign_id]) {
        campaignMap[row.campaign_id] = {
          campaign_id: row.campaign_id,
          subject: row.subject,
          sent: 0,
          failed: 0,
          pending: 0,
          last_sent: null,
          status: row.status === "sent" ? "in_progress" : row.status
        };
      }
      
      if (row.status === "sent") {
        campaignMap[row.campaign_id].sent++;
        if (!campaignMap[row.campaign_id].last_sent || row.sent_at > campaignMap[row.campaign_id].last_sent) {
          campaignMap[row.campaign_id].last_sent = row.sent_at;
        }
      } else if (row.status === "failed") {
        campaignMap[row.campaign_id].failed++;
      } else if (row.status === "pending") {
        campaignMap[row.campaign_id].pending++;
      }
    }

    const campaignList = Object.values(campaignMap).map(c => ({
      ...c,
      status: c.pending > 0 ? "in_progress" : c.sent > 0 ? "completed" : "pending"
    }));

    const today = new Date().toISOString().split("T")[0];
    const { data: todaySent } = await supabaseAdmin
      .from("email_campaigns")
      .select("recipient_email", { count: "exact" })
      .eq("status", "sent")
      .gte("sent_at", today);

    const { data: allPending } = await supabaseAdmin
      .from("email_campaigns")
      .select("recipient_email", { count: "exact" })
      .eq("status", "pending");

    return NextResponse.json({
      success: true,
      campaigns: campaignList,
      daily_limit: DAILY_LIMIT,
      sent_today: todaySent?.length || 0,
      remaining_today: Math.max(0, DAILY_LIMIT - (todaySent?.length || 0)),
      total_pending: allPending?.length || 0
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : "Unknown error"
    }, { status: 500 });
  }
}