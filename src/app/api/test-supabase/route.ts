import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Debug - check what env vars are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET() {
  const debug: Record<string, unknown> = {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    url: supabaseUrl?.substring(0, 30) + "...",
    keyPreview: supabaseKey ? supabaseKey.substring(0, 20) + "..." : "NOT SET"
  };

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({
      success: false,
      ...debug,
      error: "Missing env vars"
    }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from("waitlist_users")
      .select("id, email, full_name")
      .limit(5);

    debug.supabaseResponse = { data, error };

    if (error) {
      return NextResponse.json({
        success: false,
        ...debug,
        error: error.message,
        code: error.code
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      ...debug,
      users: data,
      count: data?.length || 0
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      ...debug,
      error: err instanceof Error ? err.message : "Unknown error"
    }, { status: 500 });
  }
}
