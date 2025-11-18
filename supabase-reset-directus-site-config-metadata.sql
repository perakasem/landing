-- Reset Directus metadata for site_config collection
-- This forces Directus to re-detect the correct schema

-- Step 1: Delete all cached field metadata for site_config
DELETE FROM directus_fields WHERE collection = 'site_config';

-- Step 2: Delete collection metadata if it exists
DELETE FROM directus_collections WHERE collection = 'site_config';

-- Step 3: Verify the site_config table exists and has correct columns
-- (This is just for verification, not modifying anything)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'site_config'
ORDER BY ordinal_position;

-- After running this SQL, refresh Directus and the collection should appear with all the correct fields
