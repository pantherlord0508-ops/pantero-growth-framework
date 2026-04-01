import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createLogger } from "@/lib/logger";
import { withErrorHandling } from "@/lib/api-response";

const log = createLogger({ route: "api/admin/export" });

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
  return withErrorHandling(async () => {
    log.info("CSV export request started");

    const { data: users, error } = await supabaseAdmin
      .from("waitlist_users")
      .select("position, full_name, email, whatsapp_number, referral_code, referral_count, joined_at, source")
      .order("position", { ascending: true });

    if (error) {
      log.error({ err: error }, "Export query failed");
      throw error;
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

    log.info({ rowCount: rows.length }, "CSV export completed");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="pantero-waitlist-export.csv"',
      },
    });
  });
}
