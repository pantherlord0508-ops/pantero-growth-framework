/**
 * Unit tests for src/lib/schemas/index.ts
 */

import { describe, it, expect } from "vitest";
import {
  signupSchema,
  referralQuerySchema,
  adminLoginSchema,
  adminUsersQuerySchema,
  createMilestoneSchema,
  updateMilestoneSchema,
  updateSettingsSchema,
  bulkEmailSchema,
} from "./index";

describe("signupSchema", () => {
  const validInput = {
    full_name: "John Doe",
    email: "john@example.com",
    whatsapp_number: "+1234567890",
  };

  it("accepts valid input", () => {
    const result = signupSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("accepts optional fields", () => {
    const result = signupSchema.safeParse({
      ...validInput,
      how_heard: "Twitter",
      company_role: "Developer",
      referral_code: "ABC123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects name shorter than 2 chars", () => {
    const result = signupSchema.safeParse({ ...validInput, full_name: "A" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = signupSchema.safeParse({ ...validInput, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects whatsapp shorter than 7 chars", () => {
    const result = signupSchema.safeParse({ ...validInput, whatsapp_number: "123" });
    expect(result.success).toBe(false);
  });

  it("normalizes email to lowercase", () => {
    const result = signupSchema.safeParse({ ...validInput, email: "JOHN@EXAMPLE.COM" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("john@example.com");
    }
  });

  it("trims whitespace from inputs", () => {
    const result = signupSchema.safeParse({
      full_name: "  John Doe  ",
      email: "  john@example.com  ",
      whatsapp_number: "  +1234567890  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.full_name).toBe("John Doe");
      expect(result.data.email).toBe("john@example.com");
      expect(result.data.whatsapp_number).toBe("+1234567890");
    }
  });
});

describe("referralQuerySchema", () => {
  it("accepts valid referral code", () => {
    const result = referralQuerySchema.safeParse({ code: "ABC123" });
    expect(result.success).toBe(true);
  });

  it("rejects empty code", () => {
    const result = referralQuerySchema.safeParse({ code: "" });
    expect(result.success).toBe(false);
  });
});

describe("adminLoginSchema", () => {
  it("accepts valid credentials", () => {
    const result = adminLoginSchema.safeParse({
      username: "admin",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty username", () => {
    const result = adminLoginSchema.safeParse({ username: "", password: "pass" });
    expect(result.success).toBe(false);
  });
});

describe("adminUsersQuerySchema", () => {
  it("applies defaults for missing params", () => {
    const result = adminUsersQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(20);
      expect(result.data.sort_by).toBe("joined_at");
      expect(result.data.sort_order).toBe("desc");
    }
  });

  it("coerces string numbers to numbers", () => {
    const result = adminUsersQuerySchema.safeParse({ page: "3", limit: "50" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.limit).toBe(50);
    }
  });

  it("rejects invalid sort_by", () => {
    const result = adminUsersQuerySchema.safeParse({ sort_by: "invalid_field" });
    expect(result.success).toBe(false);
  });

  it("rejects limit over 100", () => {
    const result = adminUsersQuerySchema.safeParse({ limit: 101 });
    expect(result.success).toBe(false);
  });
});

describe("createMilestoneSchema", () => {
  it("accepts valid milestone", () => {
    const result = createMilestoneSchema.safeParse({
      name: "Starter",
      description: "First milestone",
      target_count: 100,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = createMilestoneSchema.safeParse({ target_count: 100 });
    expect(result.success).toBe(false);
  });

  it("rejects target_count less than 1", () => {
    const result = createMilestoneSchema.safeParse({ name: "Test", target_count: 0 });
    expect(result.success).toBe(false);
  });
});

describe("updateMilestoneSchema", () => {
  it("accepts valid update", () => {
    const result = updateMilestoneSchema.safeParse({
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Updated",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid UUID", () => {
    const result = updateMilestoneSchema.safeParse({ id: "not-a-uuid" });
    expect(result.success).toBe(false);
  });
});

describe("updateSettingsSchema", () => {
  it("accepts valid settings object", () => {
    const result = updateSettingsSchema.safeParse({
      settings: { key1: "value1", key2: "value2" },
    });
    expect(result.success).toBe(true);
  });

  it("accepts null values", () => {
    const result = updateSettingsSchema.safeParse({
      settings: { key1: null },
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-object settings", () => {
    const result = updateSettingsSchema.safeParse({ settings: "invalid" });
    expect(result.success).toBe(false);
  });
});

describe("bulkEmailSchema", () => {
  it("accepts valid email", () => {
    const result = bulkEmailSchema.safeParse({
      subject: "Hello",
      body: "<p>World</p>",
    });
    expect(result.success).toBe(true);
  });

  it("accepts optional filter", () => {
    const result = bulkEmailSchema.safeParse({
      subject: "Hello",
      body: "<p>World</p>",
      filter: { min_referrals: 5 },
    });
    expect(result.success).toBe(true);
  });

  it("rejects subject over 200 chars", () => {
    const result = bulkEmailSchema.safeParse({
      subject: "x".repeat(201),
      body: "body",
    });
    expect(result.success).toBe(false);
  });
});
