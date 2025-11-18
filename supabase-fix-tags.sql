-- Fix Tags Field for Directus Compatibility
-- Run this in Supabase SQL Editor to convert tags from TEXT[] to JSONB

-- Step 1: Add a temporary JSONB column
ALTER TABLE posts ADD COLUMN tags_jsonb JSONB;

-- Step 2: Convert existing TEXT[] data to JSONB
UPDATE posts
SET tags_jsonb = to_jsonb(tags);

-- Step 3: Drop the old TEXT[] column
ALTER TABLE posts DROP COLUMN tags;

-- Step 4: Rename the JSONB column to tags
ALTER TABLE posts RENAME COLUMN tags_jsonb TO tags;

-- Step 5: Add NOT NULL constraint and default
ALTER TABLE posts
ALTER COLUMN tags SET NOT NULL,
ALTER COLUMN tags SET DEFAULT '[]'::jsonb;

-- Step 6: Update the index
DROP INDEX IF EXISTS idx_posts_tags;
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- Step 7: Update the published_posts view
DROP VIEW IF EXISTS published_posts;
CREATE OR REPLACE VIEW published_posts AS
SELECT
    id,
    slug,
    title,
    subtitle,
    form,
    category,
    date,
    tags,
    chapter,
    excerpt,
    content,
    featured_image,
    created_at,
    updated_at
FROM posts
WHERE published = true
ORDER BY date DESC;

-- Grant access to views
GRANT SELECT ON published_posts TO anon, authenticated;

-- Verify the change
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'posts' AND column_name = 'tags';
