import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { updateSettingsSchema } from "@/lib/schemas";
import { apiSuccess, apiError, handleZodError, withErrorHandling } from "@/lib/api-response";
import { createLogger } from "@/lib/logger";

const log = createLogger({ route: "api/admin/settings" });

export async function GET() {
  return withErrorHandling(async () => {
    log.info("Settings list request");

    const { data: settings, error } = await supabaseAdmin
      .from("admin_settings")
      .select("*")
      .order("setting_key", { ascending: true });

    if (error) {
      log.error({ err: error }, "Failed to fetch settings");
      throw error;
    }

    log.info({ count: settings?.length ?? 0 }, "Settings list returned");
    return apiSuccess({ settings: settings || [] });
  });
}

export async function PUT(request: NextRequest) {
  return withErrorHandling(async () => {
    const body = await request.json();
    const parsed = updateSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const { settings } = parsed.data;

    log.info({ keys: Object.keys(settings) }, "Updating settings");

    const entries = Object.entries(settings) as [string, string | null][];

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
      log.error("Failed to update some settings");
      return apiError("DB_ERROR", "Failed to update some settings", 500);
    }

    log.info({ updatedCount: entries.length }, "Settings updated");
    return apiSuccess({ success: true });
  });
}
