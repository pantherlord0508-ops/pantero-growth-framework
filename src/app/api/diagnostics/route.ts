import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cmqzshcmwgkjsciuvztc.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const diagnostics: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      checks: {},
    };

    const { data: healthCheck, error: healthError } = await supabaseAdmin
      .from("waitlist_users")
      .select("id")
      .limit(1);

    diagnostics.checks.database = {
      connected: !healthError,
      error: healthError?.message || null,
    };

    const { count, error: countError } = await supabaseAdmin
      .from("waitlist_users")
      .select("*", { count: "exact", head: true });

    diagnostics.checks.user_count = {
      count: count || 0,
      error: countError?.message || null,
    };

    const resendKey = process.env.RESEND_API_KEY;
    diagnostics.checks.email = {
      configured: !!resendKey,
      keyPrefix: resendKey ? resendKey.substring(0, 10) + "..." : "NOT SET",
    };

    diagnostics.checks.environment = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      resendApiKey: !!process.env.RESEND_API_KEY,
      appUrl: process.env.NEXT_PUBLIC_APP_URL || "NOT SET",
    };

    const { data: recentUsers, error } = await supabaseAdmin
      .from("waitlist_users")
      .select("email, joined_at, position")
      .order("joined_at", { ascending: false })
      .limit(5);

    diagnostics.recent_signups = recentUsers || [];
    if (error) {
      diagnostics.recent_signups_error = error.message;
    }

    return NextResponse.json(diagnostics);
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : "Unknown error"
    }, { status: 500 });
  }
}