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

export type WaitlistUser = Database["public"]["Tables"]["waitlist_users"]["Row"];
export type Referral = Database["public"]["Tables"]["referrals"]["Row"];
export type Milestone = Database["public"]["Tables"]["milestones"]["Row"];
export type AdminSetting = Database["public"]["Tables"]["admin_settings"]["Row"];
