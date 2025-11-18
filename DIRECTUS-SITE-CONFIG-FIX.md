# Fix Directus Site Config Schema Detection

## Problem

Directus cached old schema metadata and is looking for columns that don't exist (`key`, `value`).

Error:
```
column site_config.key does not exist
```

## Solution: Clear Directus Metadata Cache

### Step 1: Run SQL in Supabase

Go to **Supabase SQL Editor** and run this:

```sql
-- Clear Directus cached metadata for site_config
DELETE FROM directus_fields WHERE collection = 'site_config';
DELETE FROM directus_collections WHERE collection = 'site_config';
```

### Step 2: Refresh Directus

1. **Go to your Directus dashboard**
2. **Hard refresh** the page (Ctrl+Shift+R or Cmd+Shift+R)
3. **Navigate to Content** → You should now see **site_config** with all the correct fields

### Step 3: Verify Fields Detected

Go to **Settings** → **Data Model** → **site_config**

You should see these fields:
- ✅ id
- ✅ title
- ✅ description
- ✅ current_chapter
- ✅ base_url
- ✅ watch_url
- ✅ watch_title
- ✅ watch_source
- ✅ media_url
- ✅ media_title
- ✅ media_source
- ✅ read_url
- ✅ read_title
- ✅ read_source
- ✅ artwork_src
- ✅ artwork_title
- ✅ artwork_artist
- ✅ created_at
- ✅ updated_at

### Step 4: Configure as Singleton

**Settings** → **Data Model** → **site_config** → **Collection Settings**

Toggle these:
- **Singleton**: ON ✅
- **Archive**: OFF
- **Sort Field**: `updated_at`

Click **Save**

### Step 5: Configure Field Interfaces

Now configure each field for better UX:

#### Site Metadata Fields

**title**
- Interface: Input
- Required: Yes
- Placeholder: "3rd Space"

**description**
- Interface: Textarea
- Required: Yes
- Rows: 3

**current_chapter**
- Interface: Input
- Required: Yes
- Placeholder: "'25"
- Font: Monospace

**base_url**
- Interface: Input
- Required: Yes
- Placeholder: "https://perakasem.co/pond"

#### Watch Section

**watch_url**
- Interface: Input
- Icon Right: link
- Placeholder: "https://youtu.be/..."

**watch_title**
- Interface: Input
- Placeholder: "The Future of Creativity"

**watch_source**
- Interface: Input
- Placeholder: "Hank Green"

#### Media Section

**media_url**
- Interface: Input
- Icon Right: link
- Placeholder: "https://youtu.be/..."

**media_title**
- Interface: Input
- Placeholder: "MF DOOM X Tatsuro Yamashita"

**media_source**
- Interface: Input
- Placeholder: "Tanda"

#### Read Section

**read_url**
- Interface: Input
- Icon Right: link
- Placeholder: "https://example.com"

**read_title**
- Interface: Input
- Placeholder: "Situational Awareness"

**read_source**
- Interface: Input
- Placeholder: "Leopold Aschenbrenner"

#### Artwork Section

**artwork_src**
- Interface: Input (or File Image if you prefer file uploads)
- Placeholder: "/blank.jpg"

**artwork_title**
- Interface: Input
- Placeholder: "Tomato Water"

**artwork_artist**
- Interface: Input
- Placeholder: "OC"

#### System Fields

**id**
- Hidden: Yes

**created_at**
- Interface: Datetime
- Read Only: Yes

**updated_at**
- Interface: Datetime
- Display: Datetime (Relative)
- Read Only: Yes

### Step 6: Organize Layout

**Settings** → **Data Model** → **site_config** → **Layout** tab

Create sections:

**Section 1: Site Metadata**
- title
- description
- current_chapter
- base_url

**Section 2: In Rotation - Watch**
- watch_url
- watch_title
- watch_source

**Section 3: In Rotation - Media**
- media_url
- media_title
- media_source

**Section 4: In Rotation - Read**
- read_url
- read_title
- read_source

**Section 5: Featured Artwork**
- artwork_src
- artwork_title
- artwork_artist

### Step 7: Test It!

1. **Go to Content** → **Site Config**
2. You should see a single edit form (because it's a singleton)
3. Edit the `title` field
4. Click **Save**
5. Check your website at `/pond` - the title should update within 5 minutes

---

## Troubleshooting

### Still seeing "column does not exist" error?

1. Make sure you ran the SQL to delete cached metadata
2. Hard refresh Directus (Ctrl+Shift+R)
3. Log out and log back in to Directus
4. Check Supabase logs for any RLS policy issues

### Fields not appearing?

Run this in Supabase SQL Editor to verify the table:
```sql
\d site_config
-- or
SELECT column_name FROM information_schema.columns
WHERE table_name = 'site_config';
```

### Can't save changes?

Check RLS policies in Supabase:
```sql
SELECT * FROM site_config LIMIT 1;
```

If this returns data, RLS is working correctly.

---

## What Changed?

**Old schema** (key-value pairs):
```
site_config (
  id,
  key,        ← Directus was looking for this
  value,      ← and this
  description
)
```

**New schema** (individual columns):
```
site_config (
  id,
  title,           ← actual columns
  description,
  current_chapter,
  base_url,
  watch_url,
  ... etc
)
```

By clearing Directus's cached metadata, we force it to re-detect the correct schema with all the proper columns.
