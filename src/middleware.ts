import { NextRequest, NextResponse } from "next/server";
import { isValidAdminToken } from "@/lib/services/admin-auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow admin login page and login API without auth
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  // Protect admin page routes (/admin/*)
  if (pathname.startsWith("/admin")) {
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

  // Protect admin API routes (/api/admin/*) - except login
  if (pathname.startsWith("/api/admin")) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token || !isValidAdminToken(token)) {
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
