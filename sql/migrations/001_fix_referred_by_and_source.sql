-- Migration: Fix referred_by FK type and source default
-- Run this if you have an existing database with the old schema
-- Date: 2026-04-01

-- 1. Fix referred_by: change from TEXT (referral_code FK) to UUID (id FK)
-- Drop the existing foreign key constraint first
ALTER TABLE waitlist_users
  DROP CONSTRAINT IF EXISTS waitlist_users_referred_by_fkey;

-- Clear any existing referred_by values that are not valid UUIDs
-- (they were previously storing referral_code strings)
UPDATE waitlist_users SET referred_by = NULL WHERE referred_by IS NOT NULL;

-- Change the column type from TEXT to UUID
ALTER TABLE waitlist_users
  ALTER COLUMN referred_by TYPE UUID USING referred_by::UUID;

-- Add the new foreign key constraint referencing id instead of referral_code
ALTER TABLE waitlist_users
  ADD CONSTRAINT waitlist_users_referred_by_fkey
  FOREIGN KEY (referred_by) REFERENCES waitlist_users(id);

-- 2. Fix source default: change from 'website' to 'web'
ALTER TABLE waitlist_users
  ALTER COLUMN source SET DEFAULT 'web';

-- 3. Add missing anon UPDATE policy for waitlist_users
CREATE POLICY "Allow anon update waitlist_users" ON waitlist_users
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- 4. Add updated_at trigger for admin_settings
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_admin_settings_updated_at ON admin_settings;
CREATE TRIGGER trg_admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
