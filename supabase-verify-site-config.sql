-- Verify site_config table has data and check current values
SELECT * FROM site_config;

-- If you see data above, test the exact query the app uses
SELECT * FROM site_config LIMIT 1;

-- Check RLS policies on site_config
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'site_config';

-- If no data appears, check if the insert worked
SELECT COUNT(*) FROM site_config;
