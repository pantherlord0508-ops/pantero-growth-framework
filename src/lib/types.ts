/**
 * Supabase database schema type definition.
 *
 * Represents the full public schema of the Postgres database backing the
 * Pantero waitlist application, including table row, insert, and update types
 * for every managed table.
 *
 * @example
 * ```ts
 * const client = createClient<Database>(url, key);
 * const { data } = await client.from("waitlist_users").select("*");
 * // data is typed as Database["public"]["Tables"]["waitlist_users"]["Row"][]
 * ```
 */
export interface Database {
  public: {
    Tables: {
      waitlist_users: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          whatsapp_number: string;
          referral_code: string;
          referred_by: string | null;
          referral_count: number;
          position: number;
          joined_at: string;
          milestone_reached: number;
          confirmed: boolean;
          how_heard: string | null;
          company_role: string | null;
          source: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          whatsapp_number: string;
          referral_code: string;
          referred_by?: string | null;
          referral_count?: number;
          position: number;
          joined_at?: string;
          milestone_reached?: number;
          confirmed?: boolean;
          how_heard?: string | null;
          company_role?: string | null;
          source?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          whatsapp_number?: string;
          referral_code?: string;
          referred_by?: string | null;
          referral_count?: number;
          position?: number;
          joined_at?: string;
          milestone_reached?: number;
          confirmed?: boolean;
          how_heard?: string | null;
          company_role?: string | null;
          source?: string;
        };
      };
      referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referee_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          referrer_id: string;
          referee_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          referrer_id?: string;
          referee_id?: string;
          created_at?: string;
        };
      };
      milestones: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          target_count: number;
          reached_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          target_count: number;
          reached_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          target_count?: number;
          reached_at?: string | null;
          created_at?: string;
        };
      };
      admin_settings: {
        Row: {
          id: string;
          setting_key: string;
          setting_value: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          setting_key: string;
          setting_value?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          setting_key?: string;
          setting_value?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}

/**
 * A single row from the `waitlist_users` table.
 *
 * Represents a user who has signed up for the Pantero waitlist, including
 * their personal details, referral code, current position, and milestone
 * progress.
 */
export type WaitlistUser = Database["public"]["Tables"]["waitlist_users"]["Row"];

/**
 * A single row from the `referrals` table.
 *
 * Links a referrer (existing user) to a referee (newly signed-up user) and
 * records when the referral was created.
 */
export type Referral = Database["public"]["Tables"]["referrals"]["Row"];

/**
 * A single row from the `milestones` table.
 *
 * Defines a waitlist milestone (e.g. "1 000 sign-ups") with a target referral
 * count and an optional timestamp indicating when it was reached.
 */
export type Milestone = Database["public"]["Tables"]["milestones"]["Row"];

/**
 * A single row from the `admin_settings` table.
 *
 * Stores a key-value pair used for application-wide configuration managed by
 * administrators.
 */
export type AdminSetting = Database["public"]["Tables"]["admin_settings"]["Row"];
