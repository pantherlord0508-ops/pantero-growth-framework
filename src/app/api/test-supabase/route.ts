import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cmqzshcmwgkjsciuvztc.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Simple count query
    const { data, error } = await supabase
      .from("waitlist_users")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      message: "Supabase connection OK"
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : "Unknown error"
    }, { status: 500 });
  }
}
