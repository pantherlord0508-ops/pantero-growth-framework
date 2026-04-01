/**
 * Waitlist service — business logic for waitlist signup operations.
 *
 * Handles referral code generation, user creation, referral tracking,
 * position calculation, and welcome email dispatch.
 *
 * @module services/waitlist
 */

import { supabaseAdmin } from "@/lib/supabase";
import type { SignupInput } from "@/lib/schemas";
import { logger } from "@/lib/logger";

const log = logger.child({ module: "waitlist-service" });

/**
 * Generates a unique alphanumeric referral code.
 *
 * @param length - Code length (default: 8)
 * @returns Random referral code string
 */
export function generateReferralCode(length = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Generates a referral code that is unique in the database.
 * Retries up to 5 times if a collision is found.
 *
 * @returns A unique referral code
 * @throws Error if unable to generate a unique code after retries
 */
export async function generateUniqueReferralCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateReferralCode();
    const { data } = await supabaseAdmin
      .from("waitlist_users")
      .select("id")
      .eq("referral_code", code)
      .maybeSingle();

    if (!data) return code;
  }
  throw new Error("Failed to generate unique referral code after 5 attempts");
}

/**
 * Looks up a referrer by their referral code.
 *
 * @param code - The referral code to look up
 * @returns The referrer's user ID, or null if not found
 */
export async function findReferrerByCode(code: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("waitlist_users")
    .select("id")
    .eq("referral_code", code)
    .maybeSingle();

  return data?.id ?? null;
}

/**
 * Checks if an email already exists in the waitlist.
 *
 * @param email - Email to check
 * @returns true if the email already exists
 */
export async function emailExists(email: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("waitlist_users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  return data !== null;
}

/**
 * Gets the current total user count for position calculation.
 *
 * @returns Total number of users in the waitlist
 */
export async function getUserCount(): Promise<number> {
  const { count } = await supabaseAdmin
    .from("waitlist_users")
    .select("*", { count: "exact", head: true });

  return count || 0;
}

export interface CreatedUser {
  id: string;
  referral_code: string;
  position: number;
}

/**
 * Creates a new waitlist user with the given data.
 *
 * @param input - Validated signup input data
 * @param position - The user's position in the waitlist
 * @param referralCode - The generated unique referral code
 * @param referredBy - The referrer's user ID, if any
 * @returns The created user record
 * @throws Error if the insert fails
 */
export async function createWaitlistUser(
  input: SignupInput,
  position: number,
  referralCode: string,
  referredBy: string | null
): Promise<CreatedUser> {
  const { data, error } = await supabaseAdmin
    .from("waitlist_users")
    .insert({
      full_name: input.full_name,
      email: input.email,
      whatsapp_number: input.whatsapp_number,
      referral_code: referralCode,
      referred_by: referredBy,
      position,
      how_heard: input.how_heard || null,
      company_role: input.company_role || null,
      source: "web",
    })
    .select("id, referral_code, position")
    .single();

  if (error || !data) {
    log.error({ err: error }, "Failed to create waitlist user");
    throw new Error("Failed to create waitlist user");
  }

  return {
    id: data.id,
    referral_code: data.referral_code,
    position: data.position,
  };
}

/**
 * Records a referral relationship and increments the referrer's count.
 *
 * @param referrerId - The referrer's user ID
 * @param refereeId - The new user's ID
 */
export async function recordReferral(
  referrerId: string,
  refereeId: string
): Promise<void> {
  await supabaseAdmin.from("referrals").insert({
    referrer_id: referrerId,
    referee_id: refereeId,
  });

  const { data: referrer } = await supabaseAdmin
    .from("waitlist_users")
    .select("referral_count")
    .eq("id", referrerId)
    .single();

  if (referrer) {
    await supabaseAdmin
      .from("waitlist_users")
      .update({ referral_count: referrer.referral_count + 1 })
      .eq("id", referrerId);
  }
}

/**
 * Recalculates all user positions based on referral count and join date.
 * Higher referral count = better position. Earlier join date breaks ties.
 */
export async function recalculatePositions(): Promise<void> {
  const { data: users } = await supabaseAdmin
    .from("waitlist_users")
    .select("id, referral_count")
    .order("referral_count", { ascending: false })
    .order("joined_at", { ascending: true });

  if (!users) return;

  const updates = users.map((user, index) =>
    supabaseAdmin
      .from("waitlist_users")
      .update({ position: index + 1 })
      .eq("id", user.id)
  );

  await Promise.all(updates);
}

/**
 * Sends the welcome email asynchronously (fire-and-forget).
 * Failures are logged but do not block the signup response.
 *
 * @param email - User's email address
 * @param fullName - User's full name
 * @param referralCode - User's referral code
 * @param position - User's waitlist position
 */
export async function dispatchWelcomeEmail(
  email: string,
  fullName: string,
  referralCode: string,
  position: number
): Promise<void> {
  try {
    const { sendWelcomeEmail } = await import("@/lib/email");
    await sendWelcomeEmail({ full_name: fullName, email, referral_code: referralCode, position });
  } catch (err) {
    log.warn({ err, email }, "Welcome email delivery failed (non-blocking)");
  }
}
