# Directus Site Configuration Setup Guide

This guide shows you how to set up the `site_config` table in Directus to manage your pond.config.ts settings via CMS.

---

## Step 1: Create the Table in Supabase

Run the SQL script to create the `site_config` table:

```bash
# In Supabase SQL Editor, paste and run:
```

Paste the contents of `supabase-create-site-config-table.sql`

This creates:
- ✅ `site_config` table with all configuration fields
- ✅ Default row with your current values
- ✅ Triggers for auto-updating `updated_at` timestamp
- ✅ RLS policies for public read access

---

## Step 2: Verify Table in Directus

1. **Login to Directus**: `https://your-directus-app.onrender.com`
2. **Go to Content** → You should see **"Site Config"** collection
3. Click on it - you should see 1 row with your default values

---

## Step 3: Configure Field Interfaces

Now let's make the UI nice for editing. Go to **Settings** → **Data Model** → **site_config**

### Site Metadata Section

#### `title` field
- **Interface**: Input
- **Display**: Raw
- **Options**:
  ```json
  {
    "placeholder": "3rd Space",
    "trim": true
  }
  ```
- **Required**: Yes
- **Note**: "Main site title displayed on the pond page"

#### `description` field
- **Interface**: Textarea
- **Display**: Raw
- **Options**:
  ```json
  {
    "placeholder": "A bootleg substack of thoughts and things worth sharing.",
    "trim": true,
    "rows": 3
  }
  ```
- **Required**: Yes
- **Note**: "Site description/tagline"

#### `current_chapter` field
- **Interface**: Input
- **Display**: Raw
- **Options**:
  ```json
  {
    "placeholder": "'25",
    "trim": true,
    "font": "monospace"
  }
  ```
- **Required**: Yes
- **Note**: "Current chapter/year for filtering latest posts (e.g., '25)"

#### `base_url` field
- **Interface**: Input
- **Display**: Raw
- **Options**:
  ```json
  {
    "placeholder": "https://perakasem.co/pond",
    "trim": true,
    "font": "monospace"
  }
  ```
- **Required**: Yes
- **Note**: "Production base URL for the pond (dev uses localhost automatically)"

---

### Watch Section (Featured Video)

#### `watch_url` field
- **Interface**: Input
- **Display**: Raw
- **Options**:
  ```json
  {
    "placeholder": "https://youtu.be/...",
    "trim": true,
    "iconRight": "link"
  }
  ```
- **Required**: No
- **Note**: "URL to featured video"

#### `watch_title` field
- **Interface**: Input
- **Display**: Raw
- **Options**:
  ```json
  {
    "placeholder": "The Future of Creativity",
    "trim": true
  }
  ```
- **Required**: No
- **Note**: "Title of the featured video"

#### `watch_source` field
- **Interface**: Input
- **Display**: Raw
- **Options**:
  ```json
  {
    "placeholder": "Hank Green",
    "trim": true
  }
  ```
- **Required**: No
- **Note**: "Creator/source of the video"

---

### Media Section (Featured Music/Audio)

#### `media_url` field
- **Interface**: Input
- **Display**: Raw
- **Options**:
  ```json
  {
    "placeholder": "https://youtu.be/...",
    "trim": true,
    "iconRight": "link"
  }
  ```
- **Required**: No
- **Note**: "URL to featured music/audio"

#### `media_title` field
- **Interface**: Input
- **Display**: Raw
- **Options**:
  ```json
  {
    "placeholder": "MF DOOM X Tatsuro Yamashita",
    "trim": true
  }
  ```
- **Required**: No
- **Note**: "Title of the featured music/audio"

#### `media_source` field
- **Interface**: Input
- **Display**: Raw
- **Options**:
  ```json
  {
    "placeholder": "Tanda",
    "trim": true
  }
  ```
- **Required**: No
- **Note**: "Artist/creator of the music"

---

### Read Section (Featured Reading)

#### `read_url` field
- **Interface**: Input
- **Display**: Raw
- **Options**:
  ```json
  {
    "placeholder": "https://example.com",
    "trim": true,
    "iconRight": "link"
  }
  ```
- **Required**: No
- **Note**: "URL to featured reading"

#### `read_title` field
- **Interface**: Input
- **Display**: Raw
- **Options**:
  ```json
  {
    "placeholder": "Situational Awareness",
    "trim": true
  }
  ```
- **Required**: No
- **Note**: "Title of the featured reading"

#### `read_source` field
- **Interface**: Input
- **Display**: Raw
- **Options**:
  ```json
  {
    "placeholder": "Leopold Aschenbrenner",
    "trim": true
  }
  ```
- **Required**: No
- **Note**: "Author/creator of the reading"

---

### Artwork Section (Featured Image)

#### `artwork_src` field
- **Interface**: File Image
- **Display**: Image
- **Options**:
  ```json
  {
    "folder": "artwork"
  }
  ```
- **Required**: No
- **Note**: "Featured artwork image (or use /blank.jpg for default)"
- **Alternative**: If you prefer URL input instead of file upload:
  - **Interface**: Input
  - **Options**: `{"placeholder": "/blank.jpg", "iconRight": "image"}`

#### `artwork_title` field
- **Interface**: Input
- **Display**: Raw
- **Options**:
  ```json
  {
    "placeholder": "Tomato Water",
    "trim": true
  }
  ```
- **Required**: No
- **Note**: "Title of the featured artwork"

#### `artwork_artist` field
- **Interface**: Input
- **Display**: Raw
- **Options**:
  ```json
  {
    "placeholder": "OC",
    "trim": true
  }
  ```
- **Required**: No
- **Note**: "Artist/creator of the artwork"

---

### System Fields (Hidden/Read-Only)

#### `id` field
- **Interface**: UUID
- **Display**: Raw
- **Hidden**: Yes (hide from forms)

#### `created_at` field
- **Interface**: Datetime
- **Display**: Datetime
- **Read Only**: Yes
- **Hidden in Detail**: No (show in sidebar)

#### `updated_at` field
- **Interface**: Datetime
- **Display**: Datetime (Relative)
- **Read Only**: Yes
- **Hidden in Detail**: No (show in sidebar)

---

## Step 4: Organize the Layout

Go to **Settings** → **Data Model** → **site_config** → **Layout** tab

Create sections for better organization:

### Section 1: Site Metadata
- title
- description
- current_chapter
- base_url

### Section 2: In Rotation - Watch
- watch_url
- watch_title
- watch_source

### Section 3: In Rotation - Media
- media_url
- media_title
- media_source

### Section 4: In Rotation - Read
- read_url
- read_title
- read_source

### Section 5: Featured Artwork
- artwork_src
- artwork_title
- artwork_artist

---

## Step 5: Set Collection Settings

Go to **Settings** → **Data Model** → **site_config** → **Collection Settings**

- **Singleton**: Toggle ON ✅
  - This ensures only 1 configuration row exists
  - Hides "Create New" button
  - Directly shows the edit form

- **Archive**: Toggle OFF
  - Prevent accidental archiving

- **Sort Field**: `updated_at` (descending)

- **Display Template**: `{{title}} - {{description}}`

---

## Step 6: Test the Integration

1. **Edit a field in Directus**:
   - Go to **Content** → **Site Config**
   - Change the `title` to something new (e.g., "3rd Space - Updated")
   - Click **Save**

2. **Check your production site**:
   - Visit `https://perakasem.co/pond`
   - The title should update within 5 minutes (cache TTL)

3. **Force immediate update** (optional):
   - Restart your Vercel deployment to clear server cache
   - Or wait 5 minutes for cache to expire

---

## How It Works

### Data Flow

```
Directus CMS (Edit form)
    ↓ writes to
Supabase (site_config table)
    ↓ reads from (with 5min cache)
Server (config loader)
    ↓ passes to
SvelteKit Pages (data.config)
```

### Caching

The config loader uses a 5-minute cache to avoid hitting the database on every request:

- **First request**: Fetches from Supabase
- **Subsequent requests** (within 5min): Uses cached value
- **After 5min**: Re-fetches from database

This means:
- ✅ Fast performance (no DB call on most requests)
- ✅ Updates appear within ~5 minutes
- ✅ Fallback to hardcoded defaults if DB is unavailable

### Fallback Behavior

If the database is unavailable or the table is empty:
- Server falls back to hardcoded defaults in `src/lib/server/config.ts`
- Site continues to work normally
- Warning logged to console

---

## Troubleshooting

### Config Not Updating on Site

**Check:**
1. Verify changes were saved in Directus
2. Wait 5 minutes for cache to expire
3. Check Vercel deployment logs for errors
4. Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` env vars are set in Vercel

**Force update:**
```bash
# In Vercel, trigger a new deployment
# Or clear cache by restarting the server
```

### Directus Shows Empty Collection

**Fix:**
1. Make sure you ran the SQL script in Supabase
2. Check that RLS policies allow reading from `site_config`
3. Verify Directus is connected to the correct database

### "Singleton" Not Working

**Check:**
1. Settings → Data Model → site_config → Collection Settings
2. Toggle "Singleton" ON
3. Refresh Directus dashboard

---

## Optional: Custom Validation

You can add validation rules in Directus:

### URL Fields (watch_url, media_url, read_url, base_url)

**Validation Rule:**
```json
{
  "_and": [
    {
      "watch_url": {
        "_regex": "^https?://"
      }
    }
  ]
}
```

### Current Chapter Format

**Validation Rule:**
```json
{
  "_and": [
    {
      "current_chapter": {
        "_regex": "^'[0-9]{2}$"
      }
    }
  ]
}
```

This ensures chapter is in format `'25`, `'24`, etc.

---

## Next Steps

Once set up, you can:

1. **Update site metadata** without touching code
2. **Change "In Rotation" items** weekly/monthly
3. **Swap featured artwork** seasonally
4. **Adjust descriptions** for SEO

All changes appear on your production site automatically within 5 minutes!

---

**Questions?** Check the code:
- SQL script: `supabase-create-site-config-table.sql`
- Type definitions: `src/lib/types/database.ts`
- Config loader: `src/lib/server/config.ts`
- Layout loader: `src/routes/(pond)/+layout.server.ts`
