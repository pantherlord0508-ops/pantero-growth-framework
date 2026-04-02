import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cmqzshcmwgkjsciuvztc.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data: settings, error } = await supabaseAdmin
      .from("admin_settings")
      .select("*")
      .order("setting_key", { ascending: true });

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      settings: settings || []
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({
      success: false,
      error: message
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({
        success: false,
        error: "Invalid settings object"
      }, { status: 400 });
    }

    const entries = Object.entries(settings);
    const results = [];

    for (const [key, value] of entries) {
      const { data, error } = await supabaseAdmin
        .from("admin_settings")
        .upsert({
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString(),
        }, { onConflict: "setting_key" })
        .select()
        .single();

      results.push({ key, data, error });
    }

    const hasError = results.some((r) => r.error);

    if (hasError) {
      return NextResponse.json({
        success: false,
        error: "Failed to update some settings"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      updated: entries.length
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({
      success: false,
      error: message
    }, { status: 500 });
  }
}