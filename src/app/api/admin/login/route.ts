import { NextRequest, NextResponse } from "next/server";
import { adminLoginSchema } from "@/lib/schemas";
import { generateAdminToken, validateAdminCredentials, isValidAdminToken } from "./middleware";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (token && isValidAdminToken(token)) {
    return NextResponse.json({ success: true, authenticated: true });
  }
  return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    const { username, password } = parsed.data;
    const isValid = validateAdminCredentials(username, password);
    
    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const token = generateAdminToken(username);

    const response = NextResponse.json({ success: true, username });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ success: false, error: "Service error" }, { status: 500 });
  }
}
