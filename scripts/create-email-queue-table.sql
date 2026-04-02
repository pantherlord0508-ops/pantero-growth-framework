-- Email queue table for scheduled bulk emails
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS email_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient querying of pending emails
CREATE INDEX IF NOT EXISTS email_queue_status_scheduled 
ON email_queue(status, scheduled_for) 
WHERE status = 'pending';

-- Index for counting sent emails today
CREATE INDEX IF NOT EXISTS email_queue_sent_today 
ON email_queue(sent_at) 
WHERE status = 'sent';