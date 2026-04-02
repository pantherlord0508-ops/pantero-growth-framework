/**
 * Supabase client initialisation for the Pantero application.
 *
 * Exposes two typed clients:
 *
 * * **`supabase`** – anon-key client safe for browser use (RLS enforced).
 * * **`supabaseAdmin`** – service-role client with elevated privileges.
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function validateEnvVars(): void {
  const missing: string[] = [];
  if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!supabaseAnonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (missing.length > 0) {
    const message = `[supabase] Missing required environment variables: ${missing.join(", ")}`;
    if (process.env.NODE_ENV === "production") {
      console.error(message);
    } else {
      console.warn(message);
    }
  }
}

/**
 * Creates a standard Supabase client authenticated with the anonymous key.
 * Row-Level Security (RLS) policies apply to all queries made through this client.
 */
function createSupabaseClient(): SupabaseClient {
  validateEnvVars();
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

/**
 * Creates an admin-level Supabase client using the service-role key.
 * Falls back to the anon client when the service-role key is not set.
 */
function createSupabaseAdminClient(): SupabaseClient {
  if (supabaseServiceKey) {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: {
        headers: {
          "x-application-name": "pantero-admin",
        },
      },
    });
  }
  console.warn("[supabase] SUPABASE_SERVICE_ROLE_KEY not set — falling back to anon client for admin operations");
  return createSupabaseClient();
}

/**
 * Default Supabase client using the anonymous key.
 * Safe for use in both client and server contexts — RLS policies are enforced.
 */
export const supabase = createSupabaseClient();

/**
 * Admin Supabase client with service-role privileges.
 * Uses the service-role key when available (bypasses RLS).
 * Do not expose this client to the browser.
 */
export const supabaseAdmin = createSupabaseAdminClient();
