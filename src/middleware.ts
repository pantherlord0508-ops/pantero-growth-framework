import { NextRequest, NextResponse } from "next/server";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

function getTokenSecret(): string {
  return process.env.ADMIN_PASSWORD || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

export function generateAdminToken(username: string): string {
  const data = `${username}:${Date.now()}:${randomBytes(16).toString("hex")}`;
  const signature = createHmac("sha256", getTokenSecret()).update(data).digest("hex");
  return `${data}.${signature}`;
}

export function validateAdminCredentials(username: string, password: string): boolean {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminUsername || !adminPassword) return false;
  return username === adminUsername && password === adminPassword;
}

function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  try {
    return timingSafeEqual(bufA, bufB);
  } catch { return false; }
}

export function isValidAdminToken(token: string): boolean {
  if (!token) return false;
  const secret = getTokenSecret();
  if (!secret) return false;
  
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return false;
  
  const data = token.substring(0, lastDot);
  const signature = token.substring(lastDot + 1);
  
  try {
    const expected = createHmac("sha256", secret).update(data).digest("hex");
    if (signature.length !== expected.length) return false;
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch { return false; }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;
  const isAuthenticated = token ? isValidAdminToken(token) : false;

  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    if (pathname === "/admin/login" && isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

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
