import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

function getTokenSecret(): string {
  return process.env.ADMIN_PASSWORD || process.env.SUPABASE_SERVICE_ROLE_KEY || "pantero-fallback-secret";
}

function isValidAdminToken(token: string): boolean {
  if (!token || token.length < 32) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  try {
    const [data, signature] = parts;
    const expected = createHmac("sha256", getTokenSecret()).update(data).digest("hex");
    if (signature.length !== expected.length) return false;
    let result = 0;
    for (let i = 0; i < signature.length; i++) {
      result |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
    }
    return result === 0;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token || !isValidAdminToken(token)) {
      const response = pathname.startsWith("/admin/")
        ? NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
        : NextResponse.redirect(new URL("/admin/login", request.url));

      if (!pathname.startsWith("/admin/")) {
        response.cookies.delete("admin_token");
      }
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
