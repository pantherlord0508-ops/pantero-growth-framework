import { NextRequest, NextResponse } from "next/server";
import { generateAdminToken, validateAdminCredentials, isValidAdminToken } from "@/lib/admin-auth";

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
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Missing credentials" }, { status: 400 });
    }

    const isValid = validateAdminCredentials(username, password);
    
    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const token = generateAdminToken(username);

    const response = NextResponse.json({ success: true, username });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: true,
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
