/**
 * Unit tests for src/lib/services/admin-auth.ts
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  generateAdminToken,
  constantTimeCompare,
  validateAdminCredentials,
  isValidAdminToken,
} from "./admin-auth";

describe("constantTimeCompare", () => {
  it("returns true for identical strings", () => {
    expect(constantTimeCompare("hello", "hello")).toBe(true);
  });

  it("returns false for different strings", () => {
    expect(constantTimeCompare("hello", "world")).toBe(false);
  });

  it("returns false for different lengths", () => {
    expect(constantTimeCompare("short", "longer string")).toBe(false);
  });

  it("returns false for empty vs non-empty", () => {
    expect(constantTimeCompare("", "a")).toBe(false);
  });

  it("returns true for two empty strings", () => {
    expect(constantTimeCompare("", "")).toBe(true);
  });
});

describe("generateAdminToken", () => {
  it("generates a token with correct format", () => {
    const token = generateAdminToken("admin");
    const parts = token.split(".");
    expect(parts.length).toBe(2);
    expect(parts[0]).toContain("admin:");
    expect(parts[1].length).toBe(64); // SHA-256 hex
  });

  it("generates unique tokens", () => {
    const token1 = generateAdminToken("admin");
    const token2 = generateAdminToken("admin");
    expect(token1).not.toBe(token2);
  });
});

describe("validateAdminCredentials", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns true for correct credentials", () => {
    process.env.ADMIN_USERNAME = "testuser";
    process.env.ADMIN_PASSWORD = "testpass";
    expect(validateAdminCredentials("testuser", "testpass")).toBe(true);
  });

  it("returns false for incorrect credentials", () => {
    process.env.ADMIN_USERNAME = "testuser";
    process.env.ADMIN_PASSWORD = "testpass";
    expect(validateAdminCredentials("wrong", "wrong")).toBe(false);
  });

  it("returns false when env vars are not set", () => {
    delete process.env.ADMIN_USERNAME;
    delete process.env.ADMIN_PASSWORD;
    expect(validateAdminCredentials("any", "any")).toBe(false);
  });
});

describe("isValidAdminToken", () => {
  it("returns false for empty token", () => {
    expect(isValidAdminToken("")).toBe(false);
  });

  it("returns false for short token", () => {
    expect(isValidAdminToken("short")).toBe(false);
  });

  it("returns false for token without dot separator", () => {
    expect(isValidAdminToken("a".repeat(50))).toBe(false);
  });

  it("returns false for token with invalid signature", () => {
    const token = "username:1234567890:randomdata." + "a".repeat(64);
    expect(isValidAdminToken(token)).toBe(false);
  });

  it("validates a properly generated token", () => {
    const token = generateAdminToken("admin");
    expect(isValidAdminToken(token)).toBe(true);
  });
});
