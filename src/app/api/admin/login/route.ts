import { NextRequest, NextResponse } from "next/server";
import { adminLoginSchema } from "@/lib/schemas";
import { generateAdminToken, validateAdminCredentials, isValidAdminToken } from "@/lib/services/admin-auth";
import { apiError, handleZodError } from "@/lib/api-response";
import { logger } from "@/lib/logger";

const log = logger.child({ module: "api/admin/login" });

export async function GET(request: NextRequest) {
  // Check if user is already authenticated
  const token = request.cookies.get("admin_token")?.value;
  if (token && isValidAdminToken(token)) {
    return NextResponse.json({ success: true, authenticated: true });
  }
  return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return handleZodError(parsed.error);
    }

    const { username, password } = parsed.data;

    if (!validateAdminCredentials(username, password)) {
      log.warn({ username }, "Failed admin login attempt");
      return apiError("INVALID_CREDENTIALS", "Invalid credentials", 401);
    }

    const token = generateAdminToken(username);

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    log.info({ username }, "Admin login successful");
    return response;
  } catch (err) {
    log.error({ err }, "Admin login error");
    return apiError("SERVICE_UNAVAILABLE", "Service unavailable", 503);
  }
}
