import { createHmac, randomBytes, timingSafeEqual } from "crypto";

export function getTokenSecret(): string {
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
