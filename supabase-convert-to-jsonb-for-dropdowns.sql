-- Convert TEXT fields to JSONB for native Directus dropdown support
-- This enables Tags interface (chip selection) for form, category, chapter

-- ============================================================================
-- UNDERSTANDING THE APPROACH
-- ============================================================================
-- TEXT fields → Only support Input interface
-- JSONB fields → Support Tags interface (chip-based selection, like dropdown)
--
-- Tradeoff: Values will be stored as single-element arrays
-- Before: form = "longform"
-- After:  form = ["longform"]
--
-- Your app will need to handle arrays, but Directus gets native chip selection!
-- ============================================================================

-- STEP 1: Convert form field (TEXT → JSONB)
-- ============================================================================

-- Add temporary JSONB column
ALTER TABLE posts ADD COLUMN form_jsonb JSONB;

-- Convert existing TEXT values to single-element JSONB arrays
UPDATE posts SET form_jsonb = to_jsonb(ARRAY[form]);

-- Drop old TEXT column
ALTER TABLE posts DROP COLUMN form;

-- Rename JSONB column to form
ALTER TABLE posts RENAME COLUMN form_jsonb TO form;

-- Add constraints
ALTER TABLE posts
    ALTER COLUMN form SET NOT NULL,
    ALTER COLUMN form SET DEFAULT '[]'::jsonb;

-- ============================================================================
-- STEP 2: Convert category field (TEXT → JSONB)
-- ============================================================================

ALTER TABLE posts ADD COLUMN category_jsonb JSONB;
UPDATE posts SET category_jsonb = to_jsonb(ARRAY[category]);
ALTER TABLE posts DROP COLUMN category;
ALTER TABLE posts RENAME COLUMN category_jsonb TO category;
ALTER TABLE posts
    ALTER COLUMN category SET NOT NULL,
    ALTER COLUMN category SET DEFAULT '[]'::jsonb;

-- ============================================================================
-- STEP 3: Convert chapter field (TEXT → JSONB)
-- ============================================================================

ALTER TABLE posts ADD COLUMN chapter_jsonb JSONB;
UPDATE posts SET chapter_jsonb = to_jsonb(ARRAY[chapter]);
ALTER TABLE posts DROP COLUMN chapter;
ALTER TABLE posts RENAME COLUMN chapter_jsonb TO chapter;
ALTER TABLE posts
    ALTER COLUMN chapter SET NOT NULL,
    ALTER COLUMN chapter SET DEFAULT '[]'::jsonb;

-- ============================================================================
-- STEP 4: Create indexes for performance
-- ============================================================================

DROP INDEX IF EXISTS idx_posts_form;
DROP INDEX IF EXISTS idx_posts_category;
DROP INDEX IF EXISTS idx_posts_chapter;

CREATE INDEX idx_posts_form ON posts USING GIN(form jsonb_path_ops);
CREATE INDEX idx_posts_category ON posts USING GIN(category jsonb_path_ops);
CREATE INDEX idx_posts_chapter ON posts USING GIN(chapter jsonb_path_ops);

-- ============================================================================
-- STEP 5: Update published_posts view
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

GRANT SELECT ON published_posts TO anon, authenticated;

-- ============================================================================
-- STEP 6: Verify conversion
-- ============================================================================

-- Check column types
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'posts'
    AND column_name IN ('form', 'category', 'chapter', 'tags')
ORDER BY column_name;

-- Expected output:
-- category | jsonb | NO | '[]'::jsonb
-- chapter  | jsonb | NO | '[]'::jsonb
-- form     | jsonb | NO | '[]'::jsonb
-- tags     | jsonb | NO | '[]'::jsonb

-- Check data conversion (sample)
SELECT
    slug,
    form,
    category,
    chapter,
    tags
FROM posts
LIMIT 3;

-- Expected output examples:
-- form:     ["longform"]
-- category: ["documentary"]
-- chapter:  ["'25"]
-- tags:     ["wildlife", "nature"]

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Fields converted to JSONB successfully';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Converted fields:';
    RAISE NOTICE '   - form: TEXT → JSONB (single-element arrays)';
    RAISE NOTICE '   - category: TEXT → JSONB (single-element arrays)';
    RAISE NOTICE '   - chapter: TEXT → JSONB (single-element arrays)';
    RAISE NOTICE '   - tags: Already JSONB (multi-element arrays)';
    RAISE NOTICE '';
    RAISE NOTICE '🎨 Directus configuration:';
    RAISE NOTICE '   All fields can now use Tags interface!';
    RAISE NOTICE '   Run: supabase-configure-directus-jsonb-fields.sql';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  Important: App code changes required';
    RAISE NOTICE '   Before: post.form = "longform"';
    RAISE NOTICE '   After:  post.form = ["longform"] → access as post.form[0]';
    RAISE NOTICE '';
    RAISE NOTICE '🔄 Next steps:';
    RAISE NOTICE '   1. Configure Directus fields (see next script)';
    RAISE NOTICE '   2. Update app code to handle arrays';
    RAISE NOTICE '   3. Test thoroughly';
END $$;
