import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createLogger } from "@/lib/logger";
import { withErrorHandling } from "@/lib/api-response";

const log = createLogger({ route: "api/diagnostics" });

export async function GET() {
  return withErrorHandling(async () => {
    log.info("Diagnostics request started");

    const diagnostics: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      checks: {},
    };

    // 1. Check Supabase connection
    try {
      const { data: healthCheck, error: healthError } = await supabaseAdmin
        .from("waitlist_users")
        .select("id")
        .limit(1);

      diagnostics.checks.database = {
        connected: !healthError,
        error: healthError?.message || null,
      };
    } catch (err) {
      diagnostics.checks.database = {
        connected: false,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }

    // 2. Check table row count
    try {
      const { count, error: countError } = await supabaseAdmin
        .from("waitlist_users")
        .select("*", { count: "exact", head: true });

      diagnostics.checks.user_count = {
        count: count || 0,
        error: countError?.message || null,
      };
    } catch (err) {
      diagnostics.checks.user_count = {
        count: 0,
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }

    // 3. Check storage buckets
    try {
      const { data: buckets, error: bucketError } = await supabaseAdmin.storage.listBuckets();
      diagnostics.checks.storage = {
        buckets: buckets?.map(b => ({ name: b.name, public: b.public })) || [],
        error: bucketError?.message || null,
      };
    } catch (err) {
      diagnostics.checks.storage = {
        buckets: [],
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }

    // 4. Check RESEND_API_KEY environment variable (not the value, just that it's set)
    const resendKey = process.env.RESEND_API_KEY;
    diagnostics.checks.email = {
      configured: !!resendKey,
      keyPrefix: resendKey ? resendKey.substring(0, 10) + "..." : "NOT SET",
    };

    // 5. Check environment variables
    diagnostics.checks.environment = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      resendApiKey: !!process.env.RESEND_API_KEY,
      appUrl: process.env.NEXT_PUBLIC_APP_URL || "NOT SET",
    };

    // 6. Get recent errors from logs (if any)
    const { data: recentUsers, error } = await supabaseAdmin
      .from("waitlist_users")
      .select("email, joined_at, position")
      .order("joined_at", { ascending: false })
      .limit(5);

    diagnostics.recent_signups = recentUsers || [];
    if (error) {
      diagnostics.recent_signups_error = error.message;
    }

    log.info(diagnostics, "Diagnostics completed");

    return NextResponse.json(diagnostics);
  });
}
