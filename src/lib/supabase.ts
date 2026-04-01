/**
 * @module supabase
 *
 * Supabase client initialisation for the Pantero application.
 *
 * Exposes two typed clients:
 *
 * * **`supabase`** – anon-key client safe for browser use (RLS enforced).
 * * **`supabaseAdmin`** – service-role client with elevated privileges.
 *   Falls back to the anon client when `SUPABASE_SERVICE_ROLE_KEY` is absent.
 *
 * Both clients are generic over the {@link Database} schema type so that
 * queries return fully typed results.
 *
 * Required environment variables:
 *
 * | Variable | Used by |
 * |---|---|
 * | `NEXT_PUBLIC_SUPABASE_URL` | both clients |
 * | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | both clients |
 * | `SUPABASE_SERVICE_ROLE_KEY` | `supabaseAdmin` (optional) |
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Creates a standard Supabase client authenticated with the anonymous key.
 *
 * Row-Level Security (RLS) policies apply to all queries made through this
 * client, making it safe for client-side / untrusted contexts.
 *
 * @returns A typed {@link SupabaseClient} instance.
 */
function createSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

/**
 * Creates an admin-level Supabase client using the service-role key.
 *
 * When `SUPABASE_SERVICE_ROLE_KEY` is available the client is configured with
 * elevated privileges (RLS is **bypassed**). Token auto-refresh and session
 * persistence are disabled because this client is intended for server-side use
 * only.
 *
 * Falls back to {@link createSupabaseClient} when the service-role key is not
 * set, ensuring the application still functions (with RLS) in development.
 *
 * @returns A typed {@link SupabaseClient} instance with admin privileges.
 */
function createSupabaseAdminClient(): SupabaseClient<Database> {
  if (supabaseServiceKey) {
    return createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return createSupabaseClient();
}

/**
 * Default Supabase client using the anonymous key.
 *
 * Safe for use in both client and server contexts — RLS policies are enforced.
 */
export const supabase = createSupabaseClient();

/**
 * Admin Supabase client with service-role privileges.
 *
 * Uses the service-role key when available (bypasses RLS), otherwise falls back
 * to the anonymous-key client. **Do not expose this client to the browser.**
 */
export const supabaseAdmin = createSupabaseAdminClient();
