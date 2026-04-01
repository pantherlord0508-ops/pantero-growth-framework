/**
 * Unit tests for src/lib/services/waitlist.ts
 */

import { describe, it, expect } from "vitest";
import { generateReferralCode } from "./waitlist";

describe("generateReferralCode", () => {
  it("generates code of default length 8", () => {
    const code = generateReferralCode();
    expect(code.length).toBe(8);
  });

  it("generates code of specified length", () => {
    const code = generateReferralCode(12);
    expect(code.length).toBe(12);
  });

  it("uses only alphanumeric characters (excluding ambiguous ones)", () => {
    const code = generateReferralCode(100);
    const validChars = /^[ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789]+$/;
    expect(validChars.test(code)).toBe(true);
  });

  it("excludes ambiguous characters (0, O, I, l, 1)", () => {
    for (let i = 0; i < 50; i++) {
      const code = generateReferralCode(20);
      expect(code).not.toContain("0");
      expect(code).not.toContain("O");
      expect(code).not.toContain("I");
      expect(code).not.toContain("l");
      expect(code).not.toContain("1");
    }
  });

  it("generates unique codes", () => {
    const codes = new Set<string>();
    for (let i = 0; i < 100; i++) {
      codes.add(generateReferralCode());
    }
    // With 100 codes of length 8, we should get very high uniqueness
    expect(codes.size).toBeGreaterThan(95);
  });
});
