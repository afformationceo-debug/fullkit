-- Fix schema-code column name mismatches
-- =========================================

-- 1. projects: code uses 'title', DB has 'name'
ALTER TABLE projects RENAME COLUMN name TO title;

-- 2. clients: code inserts contact_name/email/phone directly into clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- 3. invoices: code uses tax_rate/tax_amount/total_amount, DB has tax/total
ALTER TABLE invoices RENAME COLUMN tax TO tax_amount;
ALTER TABLE invoices RENAME COLUMN total TO total_amount;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS tax_rate NUMERIC DEFAULT 10;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
-- issue_date is NOT NULL but code doesn't always set it
ALTER TABLE invoices ALTER COLUMN issue_date SET DEFAULT CURRENT_DATE;
-- project_id is NOT NULL but invoice form treats it as optional
ALTER TABLE invoices ALTER COLUMN project_id DROP NOT NULL;

-- 4. meetings: code uses created_by, DB has organizer_id
ALTER TABLE meetings RENAME COLUMN organizer_id TO created_by;
-- code uses agenda field
ALTER TABLE meetings ADD COLUMN IF NOT EXISTS agenda TEXT;

-- 5. follow_ups: code uses content, DB has action
ALTER TABLE follow_ups RENAME COLUMN action TO content;

-- 6. maintenance_contracts: code uses scope/status, DB has is_active
ALTER TABLE maintenance_contracts ADD COLUMN IF NOT EXISTS scope TEXT;
ALTER TABLE maintenance_contracts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
-- project_id is NOT NULL but form treats it as optional
ALTER TABLE maintenance_contracts ALTER COLUMN project_id DROP NOT NULL;

-- 7. feedback: add missing columns, relax NOT NULL constraints
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS rating INT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE feedback ALTER COLUMN client_id DROP NOT NULL;
ALTER TABLE feedback ALTER COLUMN content DROP NOT NULL;

-- 8. feedback_status: code uses 'in_review'/'dismissed', DB has 'in_progress'/'closed'
-- Add missing enum values (PostgreSQL allows adding but not removing)
ALTER TYPE feedback_status ADD VALUE IF NOT EXISTS 'in_review';
ALTER TYPE feedback_status ADD VALUE IF NOT EXISTS 'dismissed';

-- 9. leads: description NOT NULL but form treats as optional
ALTER TABLE leads ALTER COLUMN description DROP NOT NULL;

-- 10. client_contacts: code uses 'role', DB has 'position'
ALTER TABLE client_contacts RENAME COLUMN position TO role;

-- 11. Update indexes for renamed columns
DROP INDEX IF EXISTS idx_blog_posts_slug;
CREATE INDEX IF NOT EXISTS idx_projects_title ON projects(title);
