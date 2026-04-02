import { NextRequest, NextResponse } from "next/server";
import { createHmac, randomBytes } from "crypto";

const SECRET_KEY = "pantero-admin-secret-key";

function isValidToken(token: string): boolean {
  if (!token) return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return false;
  const data = token.substring(0, lastDot);
  const signature = token.substring(lastDot + 1);
  const expected = createHmac("sha256", SECRET_KEY).update(data).digest("hex");
  return signature === expected;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;
  const isAuthenticated = isValidToken(token);

  // Allow login page
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!isAuthenticated) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
