import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { referralQuerySchema } from "@/lib/schemas";
import { apiError, apiSuccess, handleZodError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

const log = logger.child({ module: "api/referral" });

export async function GET(request: NextRequest) {
  const rawCode = request.nextUrl.searchParams.get("code");

  const parsed = referralQuerySchema.safeParse({ code: rawCode });
  if (!parsed.success) {
    return handleZodError(parsed.error);
  }

  const { code } = parsed.data;

  try {
    const { data: user } = await supabaseAdmin
      .from("waitlist_users")
      .select("full_name, referral_count, position")
      .eq("referral_code", code)
      .maybeSingle();

    if (!user) {
      return apiError("NOT_FOUND", "Referral code not found", 404);
    }

    return apiSuccess({
      success: true,
      user: {
        full_name: user.full_name,
        referral_count: user.referral_count,
        position: user.position,
      },
    });
  } catch (err) {
    log.error({ err, code }, "Referral lookup error");
    return apiError("INTERNAL_ERROR", "Internal server error", 500);
  }
}
