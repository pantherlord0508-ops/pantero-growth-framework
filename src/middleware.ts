import { NextRequest, NextResponse } from "next/server";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

function getTokenSecret(): string {
  return process.env.ADMIN_PASSWORD || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

function isValidAdminToken(token: string): boolean {
  if (!token) return false;
  
  // Token format is data.signature (separated by last dot)
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return false;
  
  const data = token.substring(0, lastDot);
  const signature = token.substring(lastDot + 1);
  const secret = getTokenSecret();
  
  if (!secret || !data || !signature) return false;
  
  try {
    const expected = createHmac("sha256", secret).update(data).digest("hex");
    if (signature.length !== expected.length) return false;
    
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    return timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;
  const isAuthenticated = token ? isValidAdminToken(token) : false;

  // Allow login page and login API without auth
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    if (pathname === "/admin/login" && isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
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
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
