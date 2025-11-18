-- Fix Greyed Out Dropdowns in Directus
-- Run this in Supabase SQL Editor

-- ============================================================================
-- DIAGNOSE: Check current state
-- ============================================================================

-- Check for any CHECK constraints
SELECT
    con.conname AS constraint_name,
    col.column_name,
    pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN information_schema.constraint_column_usage ccu
    ON con.conname = ccu.constraint_name
JOIN information_schema.columns col
    ON col.table_name = ccu.table_name
    AND col.column_name = ccu.column_name
WHERE ccu.table_name = 'posts'
    AND con.contype = 'c';

-- ============================================================================
-- FIX: Remove ALL CHECK constraints
-- ============================================================================

-- Drop form CHECK constraint (if exists)
DO $$
BEGIN
    -- Try multiple possible constraint names
    ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_form_check;
    ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_check;
    ALTER TABLE posts DROP CONSTRAINT IF EXISTS form_check;
    RAISE NOTICE 'Form CHECK constraints removed';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'No form CHECK constraints found';
END $$;

-- Drop any other CHECK constraints on posts table
DO $$
DECLARE
    constraint_rec RECORD;
BEGIN
    FOR constraint_rec IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'posts'::regclass
        AND contype = 'c'
    LOOP
        EXECUTE format('ALTER TABLE posts DROP CONSTRAINT IF EXISTS %I', constraint_rec.conname);
        RAISE NOTICE 'Dropped constraint: %', constraint_rec.conname;
    END LOOP;
END $$;

-- ============================================================================
-- VERIFY: Ensure no CHECK constraints remain
-- ============================================================================

SELECT
    con.conname AS remaining_constraint_name,
    pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint con
WHERE con.conrelid = 'posts'::regclass
    AND con.contype = 'c';

-- Should return empty result

-- ============================================================================
-- OPTIMIZE: Recreate indexes
-- ============================================================================

-- Drop old indexes
DROP INDEX IF EXISTS idx_posts_form;
DROP INDEX IF EXISTS idx_posts_category;

-- Create new indexes
CREATE INDEX IF NOT EXISTS idx_posts_form ON posts(form);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ All CHECK constraints removed';
    RAISE NOTICE '✅ Indexes recreated';
    RAISE NOTICE '✅ Restart Directus: docker compose restart';
END $$;
