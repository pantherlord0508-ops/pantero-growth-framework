import { NextRequest, NextResponse } from "next/server";
import { isValidAdminToken } from "@/lib/services/admin-auth";

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
