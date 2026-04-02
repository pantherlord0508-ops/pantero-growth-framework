import { NextResponse } from "next/server";

export async function GET() {
  const hasUsername = !!process.env.ADMIN_USERNAME;
  const hasPassword = !!process.env.ADMIN_PASSWORD;
  const username = process.env.ADMIN_USERNAME;
  
  return NextResponse.json({
    admin_configured: hasUsername && hasPassword,
    username: username || "NOT SET",
    has_password: hasPassword,
    node_env: process.env.NODE_ENV,
  });
}
