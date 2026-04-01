import { NextRequest, NextResponse } from "next/server";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

function getTokenSecret(): string {
  return process.env.ADMIN_PASSWORD || process.env.SUPABASE_SERVICE_ROLE_KEY || "pantero-fallback-secret";
}

function generateAdminToken(username: string): string {
  const data = `${username}:${Date.now()}:${randomBytes(16).toString("hex")}`;
  const signature = createHmac("sha256", getTokenSecret()).update(data).digest("hex");
  return `${data}.${signature}`;
}

function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  try {
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const adminUsername = process.env.ADMIN_USERNAME || "TESORO-DEV";
    const adminPassword = process.env.ADMIN_PASSWORD || "THINGSIDOFORTREASURE";

    if (!username || typeof username !== "string" || !password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const usernameMatch = constantTimeCompare(username, adminUsername);
    const passwordMatch = constantTimeCompare(password, adminPassword);

    if (!usernameMatch || !passwordMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
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

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Service unavailable" },
      { status: 503 }
    );
  }
}
