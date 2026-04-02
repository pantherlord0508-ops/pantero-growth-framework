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
 * Gets the next available position using MAX(position) + 1.
 * More reliable than count-based approach for concurrent signups.
 *
 * @returns Next available position number
 */
export async function getNextPosition(): Promise<number> {
  const { data } = await supabaseAdmin
    .from("waitlist_users")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data?.position ?? 0) + 1;
}

/**
 * @deprecated Use getNextPosition() instead for better concurrency handling.
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
 * Records a referral relationship and atomically increments the referrer's count.
 * Uses SQL-level increment to avoid read-modify-write race conditions.
 *
 * @param referrerId - The referrer's user ID
 * @param refereeId - The new user's ID
 */
export async function recordReferral(
  referrerId: string,
  refereeId: string
): Promise<void> {
  // Insert referral record
  const { error: insertError } = await supabaseAdmin.from("referrals").insert({
    referrer_id: referrerId,
    referee_id: refereeId,
  });

  if (insertError) {
    // Ignore unique constraint violations (duplicate referral)
    if (insertError.code !== "23505") {
      log.error({ err: insertError, referrerId, refereeId }, "Failed to record referral");
      throw insertError;
    }
    log.warn({ referrerId, refereeId }, "Duplicate referral ignored");
    return;
  }

  // Atomically increment referral count using RPC to avoid race conditions
  const { error: rpcError } = await supabaseAdmin.rpc("increment_referral_count", {
    user_id: referrerId,
  });

  if (rpcError) {
    // Fallback: manual increment if RPC doesn't exist
    log.warn({ err: rpcError }, "RPC increment_referral_count not available, using manual increment");
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
}

/**
 * Recalculates all user positions based on referral count and join date.
 * Uses the database function for efficient batch update.
 * Falls back to application-level batch update if the DB function is unavailable.
 */
export async function recalculatePositions(): Promise<void> {
  // Try the database function first (single SQL statement, atomic)
  const { error: rpcError } = await supabaseAdmin.rpc("recalculate_positions");

  if (!rpcError) {
    return;
  }

  // Fallback: application-level batch update
  log.warn({ err: rpcError }, "DB recalculate_positions not available, using fallback");

  const { data: users } = await supabaseAdmin
    .from("waitlist_users")
    .select("id")
    .order("referral_count", { ascending: false })
    .order("joined_at", { ascending: true });

  if (!users || users.length === 0) return;

  // Batch update using individual queries but with proper ordering
  // Process in chunks to avoid overwhelming the database
  const CHUNK_SIZE = 50;
  for (let i = 0; i < users.length; i += CHUNK_SIZE) {
    const chunk = users.slice(i, i + CHUNK_SIZE);
    const updates = chunk.map((user, chunkIndex) =>
      supabaseAdmin
        .from("waitlist_users")
        .update({ position: i + chunkIndex + 1 })
        .eq("id", user.id)
    );
    await Promise.all(updates);
  }
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
