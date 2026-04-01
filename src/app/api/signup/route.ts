import { NextRequest } from "next/server";
import { signupSchema } from "@/lib/schemas";
import {
  emailExists,
  generateUniqueReferralCode,
  findReferrerByCode,
  getUserCount,
  createWaitlistUser,
  recordReferral,
  recalculatePositions,
  dispatchWelcomeEmail,
} from "@/lib/services/waitlist";
import { apiError, apiSuccess, handleZodError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

const log = logger.child({ module: "api/signup" });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const { email, referral_code } = parsed.data;

    if (await emailExists(email)) {
      return apiError("DUPLICATE_EMAIL", "Email already registered", 409);
    }

    const uniqueCode = await generateUniqueReferralCode();
    const position = (await getUserCount()) + 1;

    let referredBy: string | null = null;
    if (referral_code) {
      referredBy = await findReferrerByCode(referral_code);
    }

    const newUser = await createWaitlistUser(parsed.data, position, uniqueCode, referredBy);

    if (referredBy) {
      await recordReferral(referredBy, newUser.id);
      await recalculatePositions();
    }

    dispatchWelcomeEmail(email, parsed.data.full_name, uniqueCode, newUser.position);

    log.info({ userId: newUser.id, position: newUser.position }, "User signed up");

    return apiSuccess({
      success: true,
      user: {
        id: newUser.id,
        referral_code: newUser.referral_code,
        position: newUser.position,
      },
    });
  } catch (err) {
    log.error({ err }, "Signup error");
    return apiError("INTERNAL_ERROR", "Internal server error", 500);
  }
}
