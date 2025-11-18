-- Comprehensive Fix for All Directus Field Issues
-- Run this in Supabase SQL Editor to fix all field type mismatches

-- ============================================================================
-- FIX 1: Tags field (TEXT[] → JSONB)
-- ============================================================================
-- Issue: Directus sends comma-separated string, PostgreSQL expects array format
-- Solution: Use JSONB which Directus handles natively

DO $$
BEGIN
    -- Check if tags is already JSONB
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'posts' AND column_name = 'tags' AND data_type = 'jsonb'
    ) THEN
        RAISE NOTICE 'Tags field is already JSONB - skipping';
    ELSE
        -- Add temporary JSONB column
        ALTER TABLE posts ADD COLUMN tags_jsonb JSONB;

        -- Convert existing TEXT[] data to JSONB
        UPDATE posts SET tags_jsonb = to_jsonb(tags);

        -- Drop old TEXT[] column
        ALTER TABLE posts DROP COLUMN tags;

        -- Rename JSONB column to tags
        ALTER TABLE posts RENAME COLUMN tags_jsonb TO tags;

        -- Add constraints
        ALTER TABLE posts
            ALTER COLUMN tags SET NOT NULL,
            ALTER COLUMN tags SET DEFAULT '[]'::jsonb;

        RAISE NOTICE 'Tags field converted to JSONB';
    END IF;
END $$;

-- ============================================================================
-- FIX 2: Form field (Remove CHECK constraint)
-- ============================================================================
-- Issue: CHECK constraint might cause issues with Directus dropdown
-- Solution: Remove constraint, rely on Directus validation

DO $$
BEGIN
    -- Drop the CHECK constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage
        WHERE table_name = 'posts' AND constraint_name LIKE '%form%check%'
    ) THEN
        ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_form_check;
        RAISE NOTICE 'Form CHECK constraint removed';
    END IF;
END $$;

-- ============================================================================
-- FIX 3: Recreate indexes
-- ============================================================================

-- Drop old indexes
DROP INDEX IF EXISTS idx_posts_tags;
DROP INDEX IF EXISTS idx_posts_slug;
DROP INDEX IF EXISTS idx_posts_published;
DROP INDEX IF EXISTS idx_posts_date;

-- Create optimized indexes
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_posts_date ON posts(date DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags jsonb_path_ops);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_form ON posts(form);

-- ============================================================================
-- FIX 4: Recreate published_posts view
-- ============================================================================

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

-- ============================================================================
-- VERIFY: Check all column types
-- ============================================================================

SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'posts'
ORDER BY ordinal_position;

-- ============================================================================
-- RESULT: Expected column types
-- ============================================================================
-- id: uuid
-- slug: text
-- title: text
-- subtitle: text
-- form: text (no CHECK constraint)
-- category: text
-- date: date
-- tags: jsonb
-- chapter: text
-- excerpt: text
-- content: text
-- published: boolean
-- featured_image: text
-- created_at: timestamp with time zone
-- updated_at: timestamp with time zone
