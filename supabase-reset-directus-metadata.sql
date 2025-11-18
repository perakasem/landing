-- Force Directus to Reset Field Metadata
-- Run this in Supabase SQL Editor to clear Directus's cached field configurations

-- ============================================================================
-- STEP 1: Delete Directus field metadata for posts collection
-- ============================================================================
-- This forces Directus to re-detect field types from the database

DELETE FROM directus_fields WHERE collection = 'posts';

-- ============================================================================
-- STEP 2: Verify deletion
-- ============================================================================

SELECT COUNT(*) as deleted_fields FROM directus_fields WHERE collection = 'posts';
-- Should return: 0

-- ============================================================================
-- STEP 3: Show current posts table schema (what Directus will detect)
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
-- Expected output:
-- ============================================================================
-- id           | uuid      | NO  | uuid_generate_v4()
-- slug         | text      | NO  |
-- title        | text      | NO  |
-- subtitle     | text      | YES |
-- form         | text      | NO  |
-- category     | text      | NO  |
-- date         | date      | NO  |
-- tags         | jsonb     | NO  | '[]'::jsonb
-- chapter      | text      | NO  |
-- excerpt      | text      | NO  |
-- content      | text      | NO  |
-- published    | boolean   | NO  | false
-- featured_image| text     | YES |
-- created_at   | timestamp | NO  | now()
-- updated_at   | timestamp | NO  | now()

-- ============================================================================
-- STEP 4: Verify no CHECK constraints exist
-- ============================================================================

SELECT
    con.conname AS constraint_name,
    pg_get_constraintdef(con.oid) AS constraint_def
FROM pg_constraint con
WHERE con.conrelid = 'posts'::regclass
    AND con.contype = 'c';

-- Should return empty (no CHECK constraints)

-- ============================================================================
-- SUCCESS
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Directus field metadata cleared';
    RAISE NOTICE '✅ Next steps:';
    RAISE NOTICE '   1. Restart Directus: docker compose restart';
    RAISE NOTICE '   2. Wait 20 seconds';
    RAISE NOTICE '   3. Login to Directus';
    RAISE NOTICE '   4. Directus will auto-detect fields fresh';
    RAISE NOTICE '   5. Go to Settings > Data Model > posts';
    RAISE NOTICE '   6. Fields should now be configurable!';
END $$;
