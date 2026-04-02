/**
 * Zod schemas for API request validation.
 *
 * Each schema corresponds to an API route's expected input.
 * Schemas are used with `schema.safeParse(body)` before business logic.
 *
 * @module schemas
 */

import { z } from "zod";

/**
 * Strips HTML tags and dangerous characters from a string.
 */
function sanitizeString(val: string): string {
  return val
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim();
}

/**
 * Schema for POST /api/signup request body.
 */
export const signupSchema = z.object({
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .transform(sanitizeString)
    .refine((val) => val.length >= 2, "Name must be at least 2 characters after sanitization"),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email must be at most 255 characters")
    .trim()
    .toLowerCase(),
  whatsapp_number: z
    .string()
    .min(7, "WhatsApp number must be at least 7 characters")
    .max(20, "WhatsApp number must be at most 20 characters")
    .regex(/^[+\d\s-]+$/, "WhatsApp number contains invalid characters")
    .trim(),
  how_heard: z
    .string()
    .max(200, "How heard must be at most 200 characters")
    .transform(sanitizeString)
    .optional(),
  company_role: z
    .string()
    .max(200, "Company/role must be at most 200 characters")
    .transform(sanitizeString)
    .optional(),
  referral_code: z
    .string()
    .max(20, "Referral code must be at most 20 characters")
    .regex(/^[A-Za-z0-9]*$/, "Referral code contains invalid characters")
    .optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;

/**
 * Schema for GET /api/referral query parameters.
 */
export const referralQuerySchema = z.object({
  code: z.string().min(1, "Referral code is required").max(20),
});

export type ReferralQuery = z.infer<typeof referralQuerySchema>;

/**
 * Schema for POST /api/admin/login request body.
 */
export const adminLoginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(100, "Username must be at most 100 characters")
    .transform(sanitizeString),
  password: z
    .string()
    .min(1, "Password is required")
    .max(200, "Password must be at most 200 characters"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

/**
 * Schema for GET /api/admin/users query parameters.
 */
export const adminUsersQuerySchema = z.object({
  search: z.string().max(200).optional().default(""),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sort_by: z
    .enum(["joined_at", "full_name", "email", "position", "referral_count"])
    .optional()
    .default("joined_at"),
  sort_order: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type AdminUsersQuery = z.infer<typeof adminUsersQuerySchema>;

/**
 * Schema for POST /api/admin/milestones request body.
 */
export const createMilestoneSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters")
    .transform(sanitizeString),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .transform(sanitizeString)
    .optional()
    .nullable(),
  target_count: z
    .number()
    .int()
    .min(1, "Target count must be at least 1"),
});

export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;

/**
 * Schema for PUT /api/admin/milestones request body.
 */
export const updateMilestoneSchema = z.object({
  id: z.string().uuid("Invalid milestone ID"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters")
    .transform(sanitizeString)
    .optional(),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .transform(sanitizeString)
    .optional()
    .nullable(),
  target_count: z
    .number()
    .int()
    .min(1, "Target count must be at least 1")
    .optional(),
});

export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;

/**
 * Schema for PUT /api/admin/settings request body.
 */
export const updateSettingsSchema = z.object({
  settings: z.record(
    z.string().max(200),
    z.string().max(10000).nullable()
  ),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;

/**
 * Schema for POST /api/admin/email request body.
 */
export const bulkEmailSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject must be at most 200 characters")
    .transform(sanitizeString),
  body: z
    .string()
    .min(1, "Body is required")
    .max(50000, "Body must be at most 50,000 characters"),
  filter: z
    .object({
      min_referrals: z.number().int().min(0).optional(),
      max_referrals: z.number().int().min(0).optional(),
    })
    .optional(),
});

export type BulkEmailInput = z.infer<typeof bulkEmailSchema>;
