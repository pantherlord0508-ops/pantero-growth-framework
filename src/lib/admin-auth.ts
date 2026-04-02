import { createHmac, randomBytes } from "crypto";

const ADMIN_USER = "TESORO-DEV";
const ADMIN_PASS = "THINGSIDOFORTREASURE";
const SECRET_KEY = "pantero-admin-secret-key";

export function generateAdminToken(username: string): string {
  const data = `${username}:${Date.now()}:${randomBytes(8).toString("hex")}`;
  const signature = createHmac("sha256", SECRET_KEY).update(data).digest("hex");
  return `${data}.${signature}`;
}

export function validateAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USER && password === ADMIN_PASS;
}

export function isValidAdminToken(token: string): boolean {
  if (!token) return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return false;
  const data = token.substring(0, lastDot);
  const signature = token.substring(lastDot + 1);
  const expected = createHmac("sha256", SECRET_KEY).update(data).digest("hex");
  return signature === expected;
}
