import { NextRequest, NextResponse } from "next/server";
import { isValidAdminToken } from "@/lib/services/admin-auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;
  const isAuthenticated = token && isValidAdminToken(token);

  // Allow access to login page and login API without auth
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    // If already authenticated, redirect to /admin
    if (pathname === "/admin/login" && isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Protect all /admin/* routes (except /admin/login which is handled above)
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      // Redirect to login page
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect all /api/admin/* routes
  if (pathname.startsWith("/api/admin")) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
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
