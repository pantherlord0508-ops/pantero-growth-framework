import { NextRequest, NextResponse } from "next/server";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

function getTokenSecret(): string {
  return process.env.ADMIN_PASSWORD || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

function isValidAdminToken(token: string): boolean {
  if (!token) {
    console.log("isValidAdminToken: token is empty");
    return false;
  }
  
  const parts = token.split(".");
  if (parts.length !== 2) {
    console.log("isValidAdminToken: invalid format, parts:", parts.length);
    return false;
  }

  try {
    const [data, signature] = parts;
    const secret = getTokenSecret();
    
    if (!secret) {
      console.log("isValidAdminToken: no secret configured");
      return false;
    }
    
    const expected = createHmac("sha256", secret).update(data).digest("hex");
    
    if (signature.length !== expected.length) {
      console.log("isValidAdminToken: signature length mismatch");
      return false;
    }

    // Use timing-safe compare
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    return timingSafeEqual(sigBuf, expBuf);
  } catch (err) {
    console.log("isValidAdminToken: error validating", err);
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;
  
  console.log("Middleware:", pathname, "token:", token ? "present" : "none");
  
  const isAuthenticated = token ? isValidAdminToken(token) : false;
  console.log("isAuthenticated:", isAuthenticated);

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
      console.log("Not authenticated, redirecting to login");
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
