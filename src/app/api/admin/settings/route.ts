import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data: settings, error } = await supabaseAdmin
    .from("admin_settings")
    .select("*")
    .order("setting_key", { ascending: true });

  if (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }

  return NextResponse.json({ settings: settings || [] });
}

export async function PUT(request: NextRequest) {
  try {
    const { settings } = await request.json();

    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid settings format" },
        { status: 400 }
      );
    }

    const entries = Object.entries(settings) as [string, string][];

    const upserts = entries.map(([key, value]) =>
      supabaseAdmin.from("admin_settings").upsert(
        {
          setting_key: key,
          setting_value: value,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "setting_key" }
      )
    );

    const results = await Promise.all(upserts);
    const hasError = results.some((r) => r.error);

    if (hasError) {
      return NextResponse.json(
        { success: false, error: "Failed to update some settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
