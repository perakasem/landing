# Debug: Config Not Loading from Database

The site config isn't updating from Directus. Here's how to debug it:

## Step 1: Verify Data Exists in Supabase

Run this in **Supabase SQL Editor**:

```sql
SELECT * FROM site_config;
```

**Expected result:** You should see 1 row with your config data.

**If empty:** Run the insert from `supabase-create-site-config-table.sql` again, specifically:

```sql
INSERT INTO site_config (
    id, title, description, current_chapter, base_url,
    watch_url, watch_title, watch_source,
    media_url, media_title, media_source,
    read_url, read_title, read_source,
    artwork_src, artwork_title, artwork_artist
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '3rd Space',
    'A bootleg substack of thoughts and things worth sharing.',
    '''25',
    'https://perakasem.co/pond',
    'https://youtu.be/Q0_W4SWHeWY?si=02AWC2EJLwpe1Owx',
    'The Future of Creativity',
    'Hank Green',
    'https://youtu.be/E8pHAQc4rxA?si=L_0o_9hUGHUmTZut',
    'MF DOOM X Tatsuro Yamashita',
    'Tanda',
    'https://situational-awareness.ai/',
    'Situational Awareness',
    'Leopold Aschenbrenner',
    '/blank.jpg',
    'Tomato Water',
    'OC'
) ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    current_chapter = EXCLUDED.current_chapter,
    base_url = EXCLUDED.base_url,
    watch_url = EXCLUDED.watch_url,
    watch_title = EXCLUDED.watch_title,
    watch_source = EXCLUDED.watch_source,
    media_url = EXCLUDED.media_url,
    media_title = EXCLUDED.media_title,
    media_source = EXCLUDED.media_source,
    read_url = EXCLUDED.read_url,
    read_title = EXCLUDED.read_title,
    read_source = EXCLUDED.read_source,
    artwork_src = EXCLUDED.artwork_src,
    artwork_title = EXCLUDED.artwork_title,
    artwork_artist = EXCLUDED.artwork_artist;
```

## Step 2: Check RLS Policies

Run this in **Supabase SQL Editor**:

```sql
SELECT * FROM pg_policies WHERE tablename = 'site_config';
```

**Expected result:** You should see at least one policy allowing SELECT for public/anon role.

**If missing:** Run this to add the policy:

```sql
-- Allow public read access to site config
DROP POLICY IF EXISTS "Allow public read access to site config" ON site_config;

CREATE POLICY "Allow public read access to site config"
    ON site_config
    FOR SELECT
    TO anon, authenticated
    USING (true);
```

## Step 3: Check Server Logs

I've added debug logging to the config loader. Check your **Vercel deployment logs** for:

```
[CONFIG] Fetching site config from database...
[CONFIG] Successfully loaded config from database: { title: '...', hasData: true }
```

**Or if there's an error:**

```
[CONFIG] Failed to fetch site config from database: [error details]
[CONFIG] Using default config
```

### How to View Logs:

1. Go to **Vercel Dashboard** → Your Project → **Deployments**
2. Click on the latest deployment
3. Go to **Functions** tab
4. Look for the function that serves `/pond`
5. Check the **Logs** for `[CONFIG]` messages

## Step 4: Test the Query Directly

Run this in **Supabase SQL Editor** to test the exact query the app uses:

```sql
SELECT * FROM site_config LIMIT 1;
```

This should return 1 row.

## Step 5: Check Environment Variables

In **Vercel** → **Settings** → **Environment Variables**, verify:

- `PUBLIC_SUPABASE_URL` is set to your Supabase URL
- `PUBLIC_SUPABASE_ANON_KEY` is set to your anon key

**These must be PUBLIC_ prefixed** because they're used in the shared client.

## Step 6: Clear Cache Manually

The config has a 5-minute cache. To force an immediate refresh:

1. **Redeploy on Vercel** (this clears server cache)
2. Or wait 5 minutes and hard refresh your browser

## Step 7: Test in Development

Run locally to see detailed logs:

```bash
npm run dev
```

Then visit `http://localhost:5173/pond` and check the terminal for `[CONFIG]` logs.

## Common Issues

### Issue: "No site config found in database"

**Cause:** Table is empty or query returns no rows

**Fix:** Run the INSERT query from Step 1

### Issue: "Failed to fetch site config: permission denied"

**Cause:** RLS policy blocking reads

**Fix:** Run the policy creation from Step 2

### Issue: "Failed to fetch site config: relation does not exist"

**Cause:** site_config table wasn't created

**Fix:** Run `supabase-create-site-config-table.sql` in Supabase SQL Editor

### Issue: Logs show success but site still shows defaults

**Cause:** Cache is serving old data

**Fix:** Wait 5 minutes or redeploy Vercel

### Issue: Environment variables not found

**Cause:** PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY not set in Vercel

**Fix:** Add them in Vercel → Settings → Environment Variables → Add

## Quick Test Script

Run this in Supabase SQL Editor to do all checks at once:

```sql
-- 1. Check if table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'site_config'
) AS table_exists;

-- 2. Check if data exists
SELECT COUNT(*) AS row_count FROM site_config;

-- 3. Check what data is there
SELECT title, description, current_chapter FROM site_config;

-- 4. Check RLS policies
SELECT policyname, cmd FROM pg_policies
WHERE tablename = 'site_config';

-- 5. Test the exact query app uses
SELECT * FROM site_config LIMIT 1;
```

## Expected Output

If everything is working, you should see:

```
table_exists: true
row_count: 1
title: "3rd Space" (or whatever you set in Directus)
description: "A bootleg substack of thoughts and things worth sharing."
current_chapter: "'25"
policyname: "Allow public read access to site config"
```

And the final SELECT should return your full config row.

---

Once you've identified the issue, let me know what you found and I can help fix it!
