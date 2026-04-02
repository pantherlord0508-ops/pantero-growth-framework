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
        error: "RESEND_API_KEY environment variable is not set"
      }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);
    const contentType = request.headers.get("content-type") || "";

    let subject: string;
    let emailBody: string;
    let attachments: File[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      subject = formData.get("subject") as string;
      emailBody = formData.get("body") as string;
      
      const attachmentFiles = formData.getAll("attachments") as File[];
      attachments = attachmentFiles.filter(f => f.size > 0);
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

    const { data: users, error } = await supabaseAdmin
      .from("waitlist_users")
      .select("email, full_name");

    if (error) {
      return NextResponse.json({
        success: false,
        error: `Database error: ${error.message}`
      }, { status: 500 });
    }

    if (!users || users.length === 0) {
      return NextResponse.json({
        success: true,
        sent_count: 0,
        message: "No recipients found"
      });
    }

    const today = new Date().toISOString().split("T")[0];

    const { data: existingEmails } = await supabaseAdmin
      .from("email_queue")
      .select("email")
      .eq("status", "sent")
      .gte("sent_at", today);

    const sentToday = existingEmails?.length || 0;
    const remainingSlots = Math.max(0, DAILY_LIMIT - sentToday);

    const emailsToSendNow = users.slice(0, remainingSlots);
    const emailsQueued = users.slice(remainingSlots);

    let sentNow = 0;
    let failedNow = 0;
    const failedNowErrors: string[] = [];

    if (emailsToSendNow.length > 0) {
      const batchPromises = emailsToSendNow.map(async (user) => {
        try {
          const emailData: {
            from: string;
            to: string;
            subject: string;
            html: string;
            attachments?: { filename: string; content: string; }[];
          } = {
            from: "Pantero Nexus <onboarding@resend.dev>",
            to: user.email,
            subject: subject,
            html: `<p>Hi ${user.full_name || 'there'},</p>${emailBody}`,
          };

          const result = await resend.emails.send(emailData);
          
          if (result.error) {
            return { success: false, email: user.email, error: result.error.message };
          }
          
          await supabaseAdmin.from("email_queue").insert({
            email: user.email,
            subject: subject,
            body: emailBody,
            status: "sent",
            sent_at: new Date().toISOString(),
          });
          
          return { success: true, email: user.email };
        } catch (err) {
          return { success: false, email: user.email, error: err instanceof Error ? err.message : "Unknown error" };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      
      for (const result of batchResults) {
        if (result.success) {
          sentNow++;
        } else {
          failedNow++;
          failedNowErrors.push(`${result.email}: ${result.error}`);
        }
      }
    }

    let queuedCount = 0;
    if (emailsQueued.length > 0) {
      const insertPromises = emailsQueued.map(user => 
        supabaseAdmin.from("email_queue").insert({
          email: user.email,
          full_name: user.full_name,
          subject: subject,
          body: emailBody,
          status: "pending",
          scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })
      );
      
      const insertResults = await Promise.all(insertPromises);
      queuedCount = insertResults.filter(r => !r.error).length;
    }

    return NextResponse.json({
      success: true,
      sent_now: sentNow,
      failed_now: failedNow,
      queued: queuedCount,
      total_recipients: users.length,
      daily_limit: DAILY_LIMIT,
      sent_today: sentToday,
      remaining_today: Math.max(0, DAILY_LIMIT - sentToday - sentNow),
      next_batch: queuedCount > 0 ? "Tomorrow at midnight" : null,
      errors: failedNowErrors.length > 0 ? failedNowErrors : undefined
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
    const today = new Date().toISOString().split("T")[0];

    const { data: sentToday } = await supabaseAdmin
      .from("email_queue")
      .select("email", { count: "exact" })
      .eq("status", "sent")
      .gte("sent_at", today);

    const { data: pending } = await supabaseAdmin
      .from("email_queue")
      .select("email", { count: "exact" })
      .eq("status", "pending");

    const { data: recentSent } = await supabaseAdmin
      .from("email_queue")
      .select("email, sent_at")
      .eq("status", "sent")
      .order("sent_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      success: true,
      daily_limit: DAILY_LIMIT,
      sent_today: sentToday?.length || 0,
      remaining_today: Math.max(0, DAILY_LIMIT - (sentToday?.length || 0)),
      pending_queue: pending?.length || 0,
      recent_sent: recentSent || []
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : "Unknown error"
    }, { status: 500 });
  }
}