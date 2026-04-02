import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cmqzshcmwgkjsciuvztc.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

const resendApiKey = process.env.RESEND_API_KEY;

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

    let query = supabaseAdmin
      .from("waitlist_users")
      .select("email, full_name");

    const { data: users, error } = await query;

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

    const sentResults = [];
    const failedResults = [];
    const BATCH_SIZE = 25;

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);
      
      const promises = batch.map(async (user) => {
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

          if (attachments.length > 0) {
            const attachmentData = await Promise.all(
              attachments.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const base64 = Buffer.from(arrayBuffer).toString("base64");
                return {
                  filename: file.name,
                  content: base64,
                };
              })
            );
            emailData.attachments = attachmentData;
          }

          const result = await resend.emails.send(emailData);
          
          if (result.error) {
            return { success: false, email: user.email, error: result.error.message };
          }
          return { success: true, email: user.email };
        } catch (err) {
          return { success: false, email: user.email, error: err instanceof Error ? err.message : "Unknown error" };
        }
      });

      const results = await Promise.all(promises);
      
      for (const result of results) {
        if (result.success) {
          sentResults.push(result.email);
        } else {
          failedResults.push(`${result.email}: ${result.error}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      sent_count: sentResults.length,
      failed_count: failedResults.length,
      total_recipients: users.length,
      errors: failedResults.length > 0 ? failedResults : undefined
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({
      success: false,
      error: message
    }, { status: 500 });
  }
}