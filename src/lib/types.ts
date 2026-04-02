/**
 * TypeScript type definitions for the Pantero waitlist application.
 *
 * Provides row types for each database table used in the application.
 */

/**
 * A single row from the `waitlist_users` table.
 */
export interface WaitlistUser {
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
}

/**
 * A single row from the `referrals` table.
 */
export interface Referral {
  id: string;
  referrer_id: string;
  referee_id: string;
  created_at: string;
}

/**
 * A single row from the `milestones` table.
 */
export interface Milestone {
  id: string;
  name: string;
  description: string | null;
  target_count: number;
  reached_at: string | null;
  created_at: string;
}

/**
 * A single row from the `admin_settings` table.
 */
export interface AdminSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  updated_at: string;
}

/**
 * @deprecated Use individual interfaces above instead.
 * Legacy Database type kept for backward compatibility.
 */
export interface Database {
  public: {
    Tables: {
      waitlist_users: {
        Row: WaitlistUser;
        Insert: Omit<WaitlistUser, "id" | "joined_at" | "milestone_reached" | "confirmed" | "referral_count"> & {
          id?: string;
          joined_at?: string;
          milestone_reached?: number;
          confirmed?: boolean;
          referral_count?: number;
        };
        Update: Partial<WaitlistUser>;
      };
      referrals: {
        Row: Referral;
        Insert: Omit<Referral, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Referral>;
      };
      milestones: {
        Row: Milestone;
        Insert: Omit<Milestone, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Milestone>;
      };
      admin_settings: {
        Row: AdminSetting;
        Insert: Omit<AdminSetting, "id" | "updated_at"> & { id?: string; updated_at?: string };
        Update: Partial<AdminSetting>;
      };
    };
  };
}
