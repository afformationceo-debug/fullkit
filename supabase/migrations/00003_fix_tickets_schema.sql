-- Fix tickets table issues
-- ========================

-- 1. tickets.description is NOT NULL but form treats as optional
ALTER TABLE tickets ALTER COLUMN description DROP NOT NULL;

-- 2. tickets.resolved_at doesn't exist but code uses it
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ;
