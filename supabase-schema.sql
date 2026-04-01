-- Pantero Growth Framework Database Schema
-- Run this in Supabase SQL Editor
-- See sql/schema.sql for the canonical version

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. waitlist_users table
-- =============================================
CREATE TABLE IF NOT EXISTS waitlist_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  whatsapp_number TEXT NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by UUID REFERENCES waitlist_users(id),
  referral_count INTEGER DEFAULT 0,
  position INTEGER NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  milestone_reached INTEGER DEFAULT 0,
  confirmed BOOLEAN DEFAULT FALSE,
  how_heard TEXT,
  company_role TEXT,
  source TEXT DEFAULT 'web'
);

-- =============================================
-- 2. referrals table
-- =============================================
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES waitlist_users(id) ON DELETE CASCADE,
  referee_id UUID NOT NULL REFERENCES waitlist_users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referrer_id, referee_id)
);

-- =============================================
-- 3. milestones table
-- =============================================
CREATE TABLE IF NOT EXISTS milestones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  target_count INTEGER NOT NULL,
  reached_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 4. admin_settings table
-- =============================================
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default milestones
INSERT INTO milestones (name, description, target_count) VALUES
  ('Starter', 'Unlock exclusive early-access content', 3),
  ('Rising Star', 'Move up 10 positions on the waitlist', 5),
  ('Ambassador', 'Get priority access + beta features', 10),
  ('Champion', 'Unlock lifetime premium benefits', 25),
  ('Legend', 'Founding member status + all perks', 50)
ON CONFLICT DO NOTHING;

-- Insert default admin settings
INSERT INTO admin_settings (setting_key, setting_value) VALUES
  ('whatsapp_community_url', 'https://whatsapp.com/channel/0029Vb7o3mAI1rcqOL8Fgg0Z'),
  ('site_announcement', ''),
  ('maintenance_mode', 'false'),
  ('brand_name', 'Pantero'),
  ('hero_title', 'Own Your Identity. Shape Your Path.'),
  ('hero_subtitle', 'Pantero gives every African a secure digital identity, an AI companion that speaks your language, and direct access to jobs and skills that matter.')
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_users_email ON waitlist_users(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_users_referral_code ON waitlist_users(referral_code);
CREATE INDEX IF NOT EXISTS idx_waitlist_users_referred_by ON waitlist_users(referred_by);
CREATE INDEX IF NOT EXISTS idx_waitlist_users_position ON waitlist_users(position);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee ON referrals(referee_id);

-- Function to generate unique referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  result TEXT := '';
  i INTEGER := 0;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get next position
CREATE OR REPLACE FUNCTION get_next_position()
RETURNS INTEGER AS $$
DECLARE
  max_pos INTEGER;
BEGIN
  SELECT COALESCE(MAX(position), 0) INTO max_pos FROM waitlist_users;
  RETURN max_pos + 1;
END;
$$ LANGUAGE plpgsql;

-- Function to recalculate positions based on referral count
CREATE OR REPLACE FUNCTION recalculate_positions()
RETURNS VOID AS $$
BEGIN
  WITH ranked AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY referral_count DESC, joined_at ASC) as new_position
    FROM waitlist_users
  )
  UPDATE waitlist_users w
  SET position = r.new_position
  FROM ranked r
  WHERE w.id = r.id;
END;
$$ LANGUAGE plpgsql;

-- Function to handle referral milestones
CREATE OR REPLACE FUNCTION check_milestone(p_user_id UUID, p_referral_count INTEGER)
RETURNS INTEGER AS $$
DECLARE
  milestone_target INTEGER;
  milestone_name TEXT;
BEGIN
  SELECT target_count, name INTO milestone_target, milestone_name
  FROM milestones
  WHERE target_count <= p_referral_count AND reached_at IS NULL
  ORDER BY target_count DESC
  LIMIT 1;

  IF milestone_target IS NOT NULL THEN
    UPDATE milestones
    SET reached_at = NOW()
    WHERE target_count = milestone_target AND reached_at IS NULL;

    UPDATE waitlist_users
    SET milestone_reached = milestone_target
    WHERE id = p_user_id;

    RETURN milestone_target;
  END IF;

  RETURN 0;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: auto-update admin_settings.updated_at
DROP TRIGGER IF EXISTS trg_admin_settings_updated_at ON admin_settings;
CREATE TRIGGER trg_admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Row Level Security (RLS) Policies
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Public can insert into waitlist_users (signup)
CREATE POLICY "Allow public signup" ON waitlist_users
  FOR INSERT TO anon WITH CHECK (true);

-- Public can read waitlist_users (for leaderboard, status)
CREATE POLICY "Allow public read" ON waitlist_users
  FOR SELECT TO anon USING (true);

-- Public can update waitlist_users (referral_count, position recalc)
CREATE POLICY "Allow anon update waitlist_users" ON waitlist_users
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Public can read referrals
CREATE POLICY "Allow public read referrals" ON referrals
  FOR SELECT TO anon USING (true);

-- Public can insert referrals
CREATE POLICY "Allow public insert referrals" ON referrals
  FOR INSERT TO anon WITH CHECK (true);

-- Public can read milestones
CREATE POLICY "Allow public read milestones" ON milestones
  FOR SELECT TO anon USING (true);

-- Public can read admin settings (for site config)
CREATE POLICY "Allow public read settings" ON admin_settings
  FOR SELECT TO anon USING (true);

-- Service role has full access
CREATE POLICY "Service role full access users" ON waitlist_users
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access referrals" ON referrals
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access milestones" ON milestones
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access settings" ON admin_settings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE waitlist_users;
ALTER PUBLICATION supabase_realtime ADD TABLE referrals;
ALTER PUBLICATION supabase_realtime ADD TABLE milestones;
