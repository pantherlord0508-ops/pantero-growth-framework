import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cmqzshcmwgkjsciuvztc.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

function escapeCsvField(field: unknown): string {
  const str = String(field ?? "");
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  if (/^[=+\-@]/.test(str)) {
    return `'${str}`;
  }
  return str;
}

export async function GET() {
  try {
    const { data: users, error } = await supabaseAdmin
      .from("waitlist_users")
      .select("position, full_name, email, whatsapp_number, referral_code, referral_count, joined_at, source")
      .order("position", { ascending: true });

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    const headers = ["Position", "Name", "Email", "WhatsApp", "Referral Code", "Referrals", "Joined At", "Source"];

    const rows = (users || []).map((user) => [
      user.position,
      user.full_name,
      user.email,
      user.whatsapp_number,
      user.referral_code,
      user.referral_count,
      user.joined_at,
      user.source,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map(escapeCsvField).join(",")),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="pantero-waitlist-export.csv"',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({
      success: false,
      error: message
    }, { status: 500 });
  }
}