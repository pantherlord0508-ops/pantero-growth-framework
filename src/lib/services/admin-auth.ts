/**
 * Admin authentication service.
 *
 * Provides token generation and validation for admin routes.
 *
 * @module services/admin-auth
 */

import { createHmac, randomBytes, timingSafeEqual } from "crypto";

/**
 * Gets the secret used for signing admin tokens.
 * Falls back to SUPABASE_SERVICE_ROLE_KEY if ADMIN_PASSWORD is not set.
 */
function getTokenSecret(): string {
  return process.env.ADMIN_PASSWORD || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

/**
 * Generates an HMAC-signed admin authentication token.
 *
 * @param username - The authenticated admin username
 * @returns A signed token string
 */
export function generateAdminToken(username: string): string {
  const data = `${username}:${Date.now()}:${randomBytes(16).toString("hex")}`;
  const signature = createHmac("sha256", getTokenSecret()).update(data).digest("hex");
  return `${data}.${signature}`;
}

/**
 * Performs a constant-time string comparison to prevent timing attacks.
 *
 * @param a - First string
 * @param b - Second string
 * @returns true if strings are equal
 */
export function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  try {
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Validates admin credentials against environment variables.
 *
 * @param username - Provided username
 * @param password - Provided password
 * @returns true if credentials are valid
 */
export function validateAdminCredentials(username: string, password: string): boolean {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    return false;
  }

  return constantTimeCompare(username, adminUsername) && constantTimeCompare(password, adminPassword);
}

/**
 * Validates an HMAC-signed admin token from a cookie.
 *
 * @param token - The token string to validate
 * @returns true if the token signature is valid
 */
export function isValidAdminToken(token: string): boolean {
  if (!token || token.length < 32) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  try {
    const [data, signature] = parts;
    const expected = createHmac("sha256", getTokenSecret()).update(data).digest("hex");
    if (signature.length !== expected.length) return false;

    let result = 0;
    for (let i = 0; i < signature.length; i++) {
      result |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
    }
    return result === 0;
  } catch {
    return false;
  }
}
