-- Check Directus Configuration in Database
-- Run this in Supabase SQL Editor to see current file storage settings

-- Check all files and their storage location
SELECT
    id,
    filename_download,
    storage,
    uploaded_on,
    CASE
        WHEN storage = 'local' THEN 'Using local storage (old)'
        WHEN storage = 'cloudflare' THEN 'Using Cloudflare R2 (correct)'
        ELSE storage
    END as storage_status
FROM directus_files
ORDER BY uploaded_on DESC
LIMIT 10;

-- Check Directus settings (if any are stored in DB)
SELECT * FROM directus_settings;

-- This will show you which storage backend each file is using
