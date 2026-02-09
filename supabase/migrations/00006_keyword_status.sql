-- Add status column with richer states
ALTER TABLE blog_keywords
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

-- Migrate existing data: used=true → 'published', used=false → 'pending'
UPDATE blog_keywords SET status = 'published' WHERE used = true;
UPDATE blog_keywords SET status = 'pending' WHERE used = false;

-- Index for cron queries (find pending keywords)
CREATE INDEX IF NOT EXISTS idx_blog_keywords_status ON blog_keywords(status);
