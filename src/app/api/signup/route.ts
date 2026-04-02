import { NextRequest } from "next/server";
import { signupSchema } from "@/lib/schemas";
import {
  emailExists,
  generateUniqueReferralCode,
  findReferrerByCode,
  getNextPosition,
  createWaitlistUser,
  recordReferral,
  recalculatePositions,
  dispatchWelcomeEmail,
  CreatedUser,
} from "@/lib/services/waitlist";
import { apiError, apiSuccess, handleZodError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

const log = logger.child({ module: "api/signup" });

// Simple in-memory rate limiter for signup endpoint
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 signups per IP per window

function getRateLimitKey(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.count++;
  return false;
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW_MS);

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    if (isRateLimited(rateLimitKey)) {
      return apiError(
        "RATE_LIMITED",
        "Too many signup attempts. Please try again later.",
        429
      );
    }

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
    const position = await getNextPosition();

    let referredBy: string | null = null;
    if (referral_code) {
      referredBy = await findReferrerByCode(referral_code);
    }

    let newUser: CreatedUser;
    try {
      newUser = await createWaitlistUser(parsed.data, position, uniqueCode, referredBy);
    } catch (createErr) {
      log.error({ err: createErr }, "Failed to create waitlist user");
      return apiError("CREATE_FAILED", "Failed to create user. Please try again.", 500);
    }

    // Record referral and recalculate positions (non-critical, don't fail on error)
    if (referredBy) {
      try {
        await recordReferral(referredBy, newUser.id);
        await recalculatePositions();
      } catch (refErr) {
        log.warn({ err: refErr }, "Failed to record referral or recalculate positions (non-critical)");
      }
    }

    // Send welcome email (fire-and-forget, don't block signup)
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
