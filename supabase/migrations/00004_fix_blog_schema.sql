-- Fix blog schema: align column names with code expectations
-- ==========================================================

-- blog_posts: rename columns to match code
ALTER TABLE blog_posts RENAME COLUMN cover_image TO cover_image_url;
ALTER TABLE blog_posts RENAME COLUMN reading_time TO reading_time_minutes;

-- blog_posts: add missing columns
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS primary_keyword TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS quality_score INT DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS keyword_density FLOAT;

-- blog_keywords: rename is_used → used
ALTER TABLE blog_keywords RENAME COLUMN is_used TO used;

-- blog_keywords: add new columns for enriched keyword management
ALTER TABLE blog_keywords ADD COLUMN IF NOT EXISTS secondary_keywords TEXT[] DEFAULT '{}';
ALTER TABLE blog_keywords ADD COLUMN IF NOT EXISTS category TEXT DEFAULT '인사이트';
ALTER TABLE blog_keywords ADD COLUMN IF NOT EXISTS target_audience TEXT;
ALTER TABLE blog_keywords ADD COLUMN IF NOT EXISTS priority INT DEFAULT 5;
ALTER TABLE blog_keywords ADD COLUMN IF NOT EXISTS service_category TEXT DEFAULT 'homepage';
ALTER TABLE blog_keywords ADD COLUMN IF NOT EXISTS blog_post_id UUID REFERENCES blog_posts(id) ON DELETE SET NULL;

-- Fix indexes for renamed columns
DROP INDEX IF EXISTS idx_blog_keywords_is_used;
CREATE INDEX IF NOT EXISTS idx_blog_keywords_used ON blog_keywords(used);
CREATE INDEX IF NOT EXISTS idx_blog_keywords_priority ON blog_keywords(priority DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- RLS: allow anon read for blog_keywords (for public blog pages)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Anon read published keywords' AND tablename = 'blog_keywords'
  ) THEN
    CREATE POLICY "Anon read published keywords" ON blog_keywords FOR SELECT TO anon USING (true);
  END IF;
END $$;
