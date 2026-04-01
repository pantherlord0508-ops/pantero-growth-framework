import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";

const log = createLogger({ route: "api/health" });

export async function GET() {
  log.info("Health check");
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
}
