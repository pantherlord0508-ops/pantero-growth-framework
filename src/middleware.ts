import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const adminRoutes = ["/admin"];
const adminApiRoutes = ["/api/admin"];

// Sub-paths that don't require auth (login flow itself)
const publicAdminPaths = ["/admin/login", "/api/admin/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and login API through without auth check
  if (publicAdminPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isAdminApiRoute = adminApiRoutes.some((route) => pathname.startsWith(route));

  if (isAdminRoute || isAdminApiRoute) {
    const adminAuth = request.cookies.get("admin_token")?.value;
    const localStorageAuth = request.headers.get("x-admin-auth");

    const isAuthenticated = adminAuth || localStorageAuth === "true";

    if (!isAuthenticated) {
      if (isAdminApiRoute) {
        return NextResponse.json(
          { success: false, error: "Unauthorized. Admin access required." },
          { status: 401 }
        );
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