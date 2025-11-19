# CMS Integration Guide

**Complete guide for managing content via Directus CMS + Supabase**

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Database Setup](#database-setup)
4. [Directus Deployment](#directus-deployment)
5. [Field Configuration](#field-configuration)
6. [Content Management](#content-management)
7. [Troubleshooting](#troubleshooting)
8. [Technical Reference](#technical-reference)

---

## Overview

This site uses a **headless CMS** architecture:

- **Directus** - Admin UI for content editing
- **Supabase** - PostgreSQL database + auth + storage
- **SvelteKit** - Frontend framework

### What You Can Manage

- ✅ **Blog Posts** - Create, edit, publish articles
- ✅ **Site Configuration** - Update site metadata, featured content
- ✅ **Images** - Upload and manage media

### Architecture

```
Directus CMS (Render/Railway)
    ↓ writes to
Supabase PostgreSQL Database
    ↓ reads from
SvelteKit App (Vercel)
    ↓ serves to
Users
```

---

## Quick Start

### Prerequisites

- Supabase account
- Render or Railway account (for Directus hosting)
- Vercel account (for site hosting)

### 5-Minute Setup

1. **Create Supabase project**

   - Sign up at https://supabase.com
   - Create new project
   - Note your project URL and anon key

2. **Run database migration**

   ```sql
   -- In Supabase SQL Editor, run:
   ```

   Copy contents of `database/schema.sql`

3. **Deploy Directus**

   - See [Directus Deployment](#directus-deployment)
   - Connect to your Supabase database

4. **Configure Vercel**

   ```bash
   # Add environment variables:
   PUBLIC_SUPABASE_URL=your-project-url
   PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Access Directus**
   - Login with admin credentials
   - Start editing content!

---

## Database Setup

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Choose organization and region
4. Set database password (save this!)
5. Wait for project initialization (~2 minutes)

### 2. Run Schema Migration

**File:** `database/schema.sql`

This creates:

- `posts` table - Blog post content
- `site_config` table - Site configuration
- `media` table - Image references
- RLS policies - Security rules
- Triggers - Auto-update timestamps

**How to run:**

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Click **"+ New Query"**
3. Paste contents of `database/schema.sql`
4. Click **"Run"**
5. Verify: Go to **Table Editor** → You should see `posts`, `site_config`, `media`

### 3. Create Site Config Row

**File:** `database/create-site-config-table.sql`

This initializes the `site_config` table with default values.

Run in **SQL Editor** same as above.

### 4. Get Credentials

Go to **Settings** → **API**:

- **Project URL**: `https://xxxxx.supabase.co`
- **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Service Role Key**: (keep secret, only for migrations)

---

## Directus Deployment

### Option A: Deploy on Render (Recommended)

**Why Render:**

- Free tier: 750 hours/month
- Easy Docker deployment
- Automatic HTTPS
- Good for small projects

**Steps:**

1. **Create Web Service**

   - Go to https://render.com
   - Click **"New +"** → **"Web Service"**
   - Choose **"Deploy an existing image"**
   - Image URL: `directus/directus:latest`

2. **Configure Environment Variables**

   ```bash
   # Admin User
   ADMIN_EMAIL=your@email.com
   ADMIN_PASSWORD=your-secure-password

   # Security Keys (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
   KEY=your-generated-key-here
   SECRET=your-generated-secret-here

   # Database (Supabase)
   DB_CLIENT=pg
   DB_HOST=db.your-project.supabase.co
   DB_PORT=5432
   DB_DATABASE=postgres
   DB_USER=postgres
   DB_PASSWORD=your-supabase-db-password

   # Directus Config
   PUBLIC_URL=https://your-app.onrender.com
   WEBSOCKETS_ENABLED=true
   CORS_ENABLED=true
   CORS_ORIGIN=true

   # Render-specific
   PORT=10000
   ```

3. **Deploy**

   - Click **"Create Web Service"**
   - Wait 3-5 minutes
   - Access at: `https://your-app.onrender.com`

4. **Update PUBLIC_URL**
   - After deployment, copy your actual Render URL
   - Update `PUBLIC_URL` environment variable
   - Render will auto-redeploy

### Option B: Deploy on Railway

**Why Railway:**

- $5/month free credit
- Faster cold starts than Render
- Great developer experience

**Steps:**

1. **Create Project**

   - Go to https://railway.app
   - Click **"New Project"**
   - **"Deploy Docker Image"**
   - Image: `directus/directus:latest`

2. **Add Environment Variables**
   (Same as Render, but use:)

   ```bash
   PUBLIC_URL=${RAILWAY_PUBLIC_DOMAIN}
   ```

3. **Deploy**
   - Railway auto-deploys
   - Access at assigned `.up.railway.app` URL

---

## Field Configuration

Once Directus is deployed and connected to Supabase, configure the UI:

### Posts Collection

**Settings** → **Data Model** → **posts**

#### Core Fields

**`title`** (String)

- Interface: Input
- Required: Yes
- Width: Full

**`subtitle`** (String)

- Interface: Input
- Required: No
- Width: Full

**`form`** (JSONB)

- Interface: Tags
- Required: Yes
- Options:
  ```json
  {
  	"placeholder": "Select form",
  	"allowCustom": false,
  	"presetChoices": [
  		{ "text": "Long Form", "value": "longform" },
  		{ "text": "Short Form", "value": "shortform" }
  	]
  }
  ```

**`category`** (JSONB)

- Interface: Tags
- Required: Yes
- Options:
  ```json
  {
  	"placeholder": "Select category",
  	"allowCustom": false,
  	"presetChoices": [
  		{ "text": "Documentary", "value": "documentary" },
  		{ "text": "Essay", "value": "essay" },
  		{ "text": "Reflection", "value": "reflection" }
  	]
  }
  ```

**`chapter`** (JSONB)

- Interface: Tags
- Required: Yes
- Options:
  ```json
  {
  	"placeholder": "Select year",
  	"allowCustom": true,
  	"presetChoices": [
  		{ "text": "'25", "value": "'25" },
  		{ "text": "'24", "value": "'24" }
  	]
  }
  ```

**`tags`** (JSONB)

- Interface: Tags
- Required: No
- Options:
  ```json
  {
  	"placeholder": "Add tags...",
  	"allowCustom": true
  }
  ```

**`content`** (Text)

- Interface: Textarea (or Input Code for markdown)
- Required: Yes
- Options:
  ```json
  {
  	"language": "markdown",
  	"lineNumber": true
  }
  ```

**`excerpt`** (String)

- Interface: Textarea
- Required: Yes
- Rows: 3

**`published`** (Boolean)

- Interface: Boolean
- Display: Badge
- Default: false
- **Note:** Make read-only in forms, use Batch Edit to publish

**`date`** (Date)

- Interface: Date
- Required: Yes
- Default: Current date

#### Layout Organization

**Section 1: Content**

- title
- subtitle
- content
- excerpt

**Section 2: Metadata**

- form
- category
- chapter
- tags
- date

**Section 3: Publishing**

- published
- created_at (read-only)
- updated_at (read-only)

#### Collection Settings

- **Singleton**: OFF
- **Archive**: ON
- **Sort Field**: `date` (descending)
- **Display Template**: `{{title}} - {{subtitle}}`

### Site Config Collection

**Settings** → **Data Model** → **site_config**

#### Collection Settings

- **Singleton**: ON ✅ (Only 1 config row allowed)
- **Archive**: OFF
- **Sort Field**: `updated_at`

#### Field Configuration

See `database/create-site-config-table.sql` for complete field list.

**Key Fields:**

- `title` - Site title ("3rd Space")
- `description` - Site tagline
- `current_chapter` - Active year filter
- `watch_url`, `watch_title`, `watch_source` - Featured video
- `media_url`, `media_title`, `media_source` - Featured music
- `read_url`, `read_title`, `read_source` - Featured reading
- `artwork_src`, `artwork_title`, `artwork_artist` - Featured artwork

**All fields:**

- Interface: Input (or Textarea for description)
- Display: Raw
- Include placeholders with current values

---

## Content Management

### Creating a New Post

1. **Go to Directus** → **Content** → **Posts**
2. Click **"Create Item"**
3. Fill in fields:

   - Title (required)
   - Subtitle (optional)
   - Content (markdown)
   - Excerpt (for listing pages)
   - Form: longform or shortform
   - Category: documentary, essay, etc.
   - Chapter: '25, '24, etc.
   - Tags: add relevant tags
   - Date: publication date
   - Published: leave as `false` (draft)

4. Click **"Save"**

### Publishing a Post

**Option 1: Batch Edit** (Recommended)

1. Select post(s) by clicking checkbox
2. Click **"Batch Edit"** at top
3. Set `published` to `true`
4. Click **"Save"**

**Option 2: Individual Edit**

1. Open post
2. Change `published` to `true`
3. Click **"Save"**

### Editing Site Configuration

1. **Go to Directus** → **Content** → **Site Config**
2. Since it's a singleton, you'll see the edit form directly
3. Update any fields (title, description, rotation items, etc.)
4. Click **"Save"**
5. Changes appear on site within 5 minutes (cache TTL)

### Unpublishing/Archiving

**Unpublish:**

- Batch Edit → Set `published` to `false`

**Archive:**

- Click **"Archive"** button → Post hidden but not deleted

**Delete:**

- Click **"Delete"** button → Permanently removes post

---

## Troubleshooting

### Posts Not Appearing on Site

**Check:**

1. **Post is published**

   - In Directus, verify `published` = true

2. **Date is not in future**

   - Posts with future dates won't show

3. **Chapter filter**

   - On `/pond`, only current chapter posts show
   - Check `/pond/archive` to see all posts

4. **Database connection**
   - Check Vercel logs for errors
   - Verify `PUBLIC_SUPABASE_URL` env var is set

### Config Changes Not Updating

**Cause:** 5-minute cache

**Solutions:**

1. **Wait 5 minutes** - Cache will auto-expire
2. **Redeploy Vercel** - Clears server cache immediately
3. **Hard refresh browser** - Clear client cache (Ctrl+Shift+R)

### Directus Shows "Column Does Not Exist"

**Cause:** Cached field metadata is stale

**Fix:**

```sql
-- In Supabase SQL Editor:
DELETE FROM directus_fields WHERE collection = 'posts';
DELETE FROM directus_collections WHERE collection = 'posts';
```

Then hard refresh Directus.

### Directus Connection Failed

**Check:**

1. **Database credentials correct**

   - `DB_HOST`, `DB_PASSWORD`, etc.

2. **Supabase allows connections**

   - Check Supabase firewall rules
   - Verify database is running

3. **RLS policies allow access**
   ```sql
   -- Check policies:
   SELECT * FROM pg_policies WHERE tablename = 'posts';
   ```

### Site Shows Defaults Instead of CMS Config

**Check Vercel logs for:**

```
[CONFIG] Fetching site config from database...
[CONFIG] Successfully loaded config from database
```

**If you see:**

```
[CONFIG] Using default config
```

Then check:

1. `site_config` table has data
2. RLS policy allows public SELECT
3. Environment variables set in Vercel

**Verify data exists:**

```sql
SELECT * FROM site_config;
```

Should return 1 row.

### "Reset Directus Metadata" Helper

**File:** `database/reset-directus-metadata.sql`

Use this if Directus is confused about table schema:

```sql
DELETE FROM directus_fields WHERE collection = 'site_config';
DELETE FROM directus_collections WHERE collection = 'site_config';
```

---

## Technical Reference

### File Structure

```
src/
├── lib/
│   ├── supabase.ts                 # Shared Supabase client
│   ├── types/
│   │   └── database.ts             # Database type definitions
│   ├── server/
│   │   ├── posts-supabase.ts       # Post loading from DB
│   │   └── config.ts               # Config loading from DB
│   └── utils.ts                    # Helper functions
├── routes/
│   └── (pond)/
│       └── pond/
│           ├── +layout.server.ts   # Loads site config
│           ├── +page.server.ts     # Loads posts for listing
│           ├── archive/
│           │   └── +page.server.ts # Loads all posts
│           └── [slug]/
│               └── +page.server.ts # Loads individual post
└── components/
    └── (various UI components)
```

### Database Schema

**Tables:**

- `posts` - Blog post content and metadata
- `site_config` - Site-wide configuration (singleton)
- `media` - Media file references

**Views:**

- `published_posts` - Only published posts (for queries)

**Policies:**

- Public SELECT on all tables
- Authenticated UPDATE on `site_config`
- Service role can do anything

### Environment Variables

**Vercel:**

```bash
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Directus:**

```bash
DB_CLIENT=pg
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USER=postgres
DB_PASSWORD=your-db-password
KEY=your-generated-key
SECRET=your-generated-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-password
PUBLIC_URL=https://directus.onrender.com
```

### JSONB Array Pattern

**Database stores:** `["longform"]`, `["documentary"]`, `["'25"]`

**App receives:** `"longform"`, `"documentary"`, `"'25"`

**Conversion:**

- `arrayToString()` in `posts-supabase.ts`
- `stringToArray()` in migration script

**Why:** Directus Tags interface requires JSONB arrays, but app uses strings for simplicity.

### Caching Strategy

**Site Config:**

- 5-minute server-side cache
- Falls back to hardcoded defaults if DB unavailable
- Cleared on Vercel redeploy

**Posts:**

- No caching (always fresh from DB)
- Sorted by date on query

---

## Deployment Checklist

### Initial Setup

- [ ] Supabase project created
- [ ] Database schema migrated
- [ ] site_config table initialized
- [ ] Credentials saved securely
- [ ] Directus deployed (Render/Railway)
- [ ] Directus environment variables configured
- [ ] Directus accessible at URL
- [ ] Connected to Supabase successfully
- [ ] Fields configured in Directus
- [ ] Singleton mode enabled for site_config
- [ ] Vercel environment variables set
- [ ] Site deployed and accessible
- [ ] Test post created and published
- [ ] Test post appears on site
- [ ] Config changes tested

### Before Going Live

- [ ] All example posts removed
- [ ] Real content added
- [ ] Site config updated with real values
- [ ] Test all links work
- [ ] Check mobile responsiveness
- [ ] Verify RSS feed works
- [ ] Test image uploads
- [ ] Confirm publish workflow works
- [ ] Set up backups (Supabase automatic)
- [ ] Document admin credentials securely

---

## Support

### Documentation

- SvelteKit: https://kit.svelte.dev
- Supabase: https://supabase.com/docs
- Directus: https://docs.directus.io

### Common Tasks

**Update dependencies:**

```bash
npm update
```

**Regenerate types:**

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/types/database.ts
```

**Run migration:**

```bash
cd scripts
npx ts-node migrate-posts-to-supabase.ts
```

---

**Last Updated:** 2025-11-19
**Version:** 2.0.0 (Consolidated)
