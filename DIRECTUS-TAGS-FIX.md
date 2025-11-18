# Fix: Directus Tags Error

> **Note**: If you're experiencing errors with multiple fields (tags, form, category), use the comprehensive fix: [`DIRECTUS-FIELD-ERRORS-FIX.md`](./DIRECTUS-FIELD-ERRORS-FIX.md)

## The Problem

You're getting this error when trying to save posts in Directus:

```json
{
  "message": "update \"posts\" set \"tags\" = $1 where \"id\" in ($2) - malformed array literal: \"documentary,wildlife,exploration,reflections\"",
  "extensions": {
    "code": "INTERNAL_SERVER_ERROR"
  }
}
```

**Root Cause**: Your `posts.tags` column is defined as `TEXT[]` (PostgreSQL array), but Directus is trying to save tags as a comma-separated string. PostgreSQL expects array format like `{tag1,tag2,tag3}`, not `tag1,tag2,tag3`.

**Solution**: Convert the `tags` column from `TEXT[]` to `JSONB`, which Directus handles much better.

---

## Quick Fix (5 minutes)

### Step 1: Run the Fix Script in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase-fix-tags.sql`
5. Click **Run** (or press Cmd/Ctrl + Enter)

The script will:
- ✅ Convert existing `TEXT[]` data to `JSONB`
- ✅ Preserve all your existing tags
- ✅ Update indexes for performance
- ✅ Recreate the `published_posts` view

### Step 2: Restart Directus

```bash
# Stop Directus
docker compose down

# Start Directus (it will detect the schema change)
docker compose up -d

# Check logs to ensure it started successfully
docker compose logs -f directus
```

### Step 3: Configure Tags Field in Directus

1. Open Directus: http://localhost:8055
2. Go to **Settings** > **Data Model** > **posts**
3. Click on **tags** field
4. Configure:
   - **Interface**: Tags
   - **Preset**: tags
   - **Options**:
     - ✅ Alphabetize
     - ✅ Allow Custom Values
     - **Whitespace**: Trim
     - **Capitalization**: Lowercase
   - Click **Save**

### Step 4: Test

1. Go to **Posts** collection
2. Click on an existing post
3. Try editing the tags:
   - Type a tag and press Enter
   - Should appear as a colored chip
   - Should be able to remove tags
4. Click **Save**
5. Should save without errors!

---

## What Changed

### Before (TEXT[])
```sql
tags TEXT[] NOT NULL DEFAULT '{}'
```

PostgreSQL stores as: `{documentary,wildlife,exploration}`

### After (JSONB)
```sql
tags JSONB NOT NULL DEFAULT '[]'::jsonb
```

PostgreSQL stores as: `["documentary", "wildlife", "exploration"]`

### Why This Works

- **JSONB** is a JSON data type in PostgreSQL
- Directus has **native JSONB support**
- JavaScript arrays map directly to JSONB arrays
- Tags interface automatically handles JSONB arrays

---

## Verify the Fix

### Check in Supabase

1. Go to Supabase Dashboard
2. Navigate to **Table Editor** > **posts**
3. Look at a post's tags column
4. Should show: `["tag1", "tag2", "tag3"]` (JSON format)

### Check in Directus

1. Open a post
2. Tags should display as chips
3. Edit and save - no errors!

---

## Alternative: Manual Fix (Without Script)

If you prefer to do it manually:

```sql
-- 1. Add temporary column
ALTER TABLE posts ADD COLUMN tags_jsonb JSONB;

-- 2. Convert data
UPDATE posts SET tags_jsonb = to_jsonb(tags);

-- 3. Drop old column
ALTER TABLE posts DROP COLUMN tags;

-- 4. Rename new column
ALTER TABLE posts RENAME COLUMN tags_jsonb TO tags;

-- 5. Add constraints
ALTER TABLE posts
  ALTER COLUMN tags SET NOT NULL,
  ALTER COLUMN tags SET DEFAULT '[]'::jsonb;

-- 6. Recreate index
DROP INDEX IF EXISTS idx_posts_tags;
CREATE INDEX idx_posts_tags ON posts USING GIN(tags jsonb_path_ops);
```

---

## Migration Script Update

The migration script (`scripts/migrate-posts-to-supabase.ts`) already handles this correctly - it converts string arrays to proper arrays automatically when inserting.

No changes needed to the migration script.

---

## Updated Schema

The main schema file (`supabase-schema.sql`) has been updated to use JSONB for new installations.

If you're setting up a new database in the future, it will use JSONB by default.

---

## Rollback (If Needed)

If you need to revert back to TEXT[] for some reason:

```sql
-- Convert JSONB back to TEXT[]
ALTER TABLE posts ADD COLUMN tags_text TEXT[];

UPDATE posts
SET tags_text = ARRAY(SELECT jsonb_array_elements_text(tags));

ALTER TABLE posts DROP COLUMN tags;
ALTER TABLE posts RENAME COLUMN tags_text TO tags;

ALTER TABLE posts
  ALTER COLUMN tags SET NOT NULL,
  ALTER COLUMN tags SET DEFAULT '{}';

CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
```

---

## Common Issues After Fix

### Issue: Tags still showing as text input

**Solution**: Reconfigure the field interface:
1. Settings > Data Model > posts > tags
2. Interface: Tags (not Input)
3. Save and refresh

### Issue: Existing tags disappeared

**Solution**: The conversion script preserves data. Check:
```sql
SELECT slug, tags FROM posts LIMIT 5;
```

If tags are empty, restore from backup or re-run migration.

### Issue: Can't add new tags

**Solution**: Check field permissions:
1. Settings > Roles & Permissions
2. Your role > posts > tags
3. Ensure Create and Update are enabled

---

## Performance Note

JSONB with GIN index is actually **faster** for tag searches than TEXT[]:

```sql
-- Search posts with specific tag (optimized with GIN index)
SELECT * FROM posts WHERE tags @> '["documentary"]'::jsonb;

-- Search posts with any of multiple tags
SELECT * FROM posts WHERE tags ?| array['documentary', 'wildlife'];
```

---

## Summary

✅ **Run** `supabase-fix-tags.sql` in Supabase SQL Editor
✅ **Restart** Directus
✅ **Configure** tags field interface to "Tags"
✅ **Test** creating and editing posts

This is a one-time fix. Once done, tags will work perfectly in Directus!

---

**Need help?** Check the Directus logs:
```bash
docker compose logs directus
```
