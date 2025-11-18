# CMS Setup Guide: Directus + Supabase

This guide explains how to set up and use the Directus CMS with Supabase for managing POND blog content and site configuration.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Supabase Setup](#supabase-setup)
4. [Directus Setup](#directus-setup)
5. [Migration from Markdown](#migration-from-markdown)
6. [Using the CMS](#using-the-cms)
7. [Deployment](#deployment)
8. [Content Page Strategy](#content-page-strategy)

---

## Architecture Overview

```
┌─────────────────┐      ┌──────────────┐      ┌─────────────┐
│  SvelteKit App  │─────▶│  Supabase    │◀─────│  Directus   │
│  (Frontend)     │      │  (Database)  │      │  (CMS UI)   │
└─────────────────┘      └──────────────┘      └─────────────┘
         │                       │                      │
         │                       │                      │
    Public Read              Storage                Manage
    (via RLS)              Media Files              Content
```

**Components:**

- **Supabase**: PostgreSQL database + storage for images/media
- **Directus**: Headless CMS for content management UI
- **SvelteKit**: Frontend application fetching data from Supabase

**Benefits:**

- ✅ No need to push to GitHub for content updates
- ✅ Non-technical users can manage content
- ✅ Rich text editing with markdown support
- ✅ Media library for images
- ✅ Version history and drafts
- ✅ Role-based access control

---

## Prerequisites

1. **Supabase Account**: Sign up at https://supabase.com
2. **Node.js**: v18+ installed
3. **Package Manager**: npm, pnpm, or yarn
4. **Directus** (choose one):
   - Directus Cloud (easiest): https://directus.cloud
   - Self-hosted: Docker or Node.js setup

---

## Supabase Setup

### Step 1: Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - Name: `pond-blog` (or your preferred name)
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
4. Wait for provisioning (~2 minutes)

### Step 2: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `supabase-schema.sql`
4. Paste and click "Run"
5. Verify tables created: `posts`, `site_config`, `media`, `content_pages`

### Step 3: Set Up Storage

1. Go to **Storage** in Supabase dashboard
2. Create a new bucket: `post-images`
3. Set bucket to **Public** (for image serving)
4. Configure CORS if needed

### Step 4: Get API Credentials

1. Go to **Settings** > **API**
2. Copy:
   - **Project URL**: `https://xxx.supabase.co`
   - **Anon/Public Key**: `eyJhbGc...`
3. Keep these for next steps

---

## Directus Setup

### Option A: Directus Cloud (Recommended)

1. Sign up at https://directus.cloud
2. Create a new project
3. Choose "Connect to external database"
4. Enter Supabase database credentials:
   ```
   Host: db.your-project.supabase.co
   Port: 5432
   Database: postgres
   User: postgres
   Password: your-supabase-password
   SSL: true
   ```
5. Wait for Directus to connect and discover schema

### Option B: Self-Hosted with Docker

```bash
# Create a directory for Directus
mkdir directus-cms
cd directus-cms

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3'
services:
  directus:
    image: directus/directus:latest
    ports:
      - 8055:8055
    volumes:
      - ./uploads:/directus/uploads
      - ./extensions:/directus/extensions
    environment:
      KEY: 'replace-with-random-key'
      SECRET: 'replace-with-random-secret'

      DB_CLIENT: 'pg'
      DB_HOST: 'db.your-project.supabase.co'
      DB_PORT: '5432'
      DB_DATABASE: 'postgres'
      DB_USER: 'postgres'
      DB_PASSWORD: 'your-supabase-password'
      DB_SSL: 'true'

      ADMIN_EMAIL: 'admin@example.com'
      ADMIN_PASSWORD: 'your-secure-password'

      CORS_ENABLED: 'true'
      CORS_ORIGIN: 'http://localhost:5173,https://perakasem.co'
EOF

# Generate random keys
echo "Generate these keys:"
echo "KEY: $(openssl rand -base64 32)"
echo "SECRET: $(openssl rand -base64 32)"

# Start Directus
docker-compose up -d

# Access at http://localhost:8055
```

### Step 5: Configure Directus Collections

After Directus connects to Supabase, configure the following:

#### Posts Collection

1. Go to **Settings** > **Data Model** > **posts**
2. Set display template: `{{title}}`
3. Configure fields:
   - **title**: String (Required, Interface: Input)
   - **slug**: String (Required, Interface: Slug, Options: from `title`)
   - **subtitle**: String (Interface: Input)
   - **content**: Text (Interface: Markdown or WYSIWYG)
   - **excerpt**: Text (Interface: Textarea)
   - **form**: Dropdown (Options: `longform`, `shortform`)
   - **category**: String (Interface: Input or Dropdown)
   - **chapter**: String (Interface: Input)
   - **date**: Date (Interface: Date)
   - **tags**: Array (Interface: Tags)
   - **published**: Boolean (Interface: Toggle, Default: false)
   - **featured_image**: File (Interface: File, Folder: `post-images`)

4. Set up collection icon and color (optional)

#### Site Config Collection

1. Go to **site_config** collection
2. Edit existing rows or create new ones
3. `pond_config`: Edit JSON value with site settings

---

## Migration from Markdown

### Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js
npm install -D tsx yaml @types/node
```

### Step 2: Set Environment Variables

Create `.env` file:

```env
PUBLIC_SUPABASE_URL=https://xxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### Step 3: Run Migration Script

```bash
npx tsx scripts/migrate-posts-to-supabase.ts
```

This will:
- Read all `.md` files from `src/posts/`
- Parse frontmatter and content
- Insert/update posts in Supabase
- Report success/errors

### Step 4: Verify Migration

1. Open Supabase dashboard
2. Go to **Table Editor** > **posts**
3. Verify all posts are present
4. Check Directus CMS - posts should appear there too

---

## Using the CMS

### Creating a New Post

1. Open Directus at your URL (e.g., `http://localhost:8055`)
2. Login with admin credentials
3. Go to **Content** > **Posts**
4. Click **Create Item** (+ button)
5. Fill in:
   - **Title**: Your post title
   - **Slug**: Auto-generated from title (editable)
   - **Content**: Write in Markdown or use WYSIWYG
   - **Excerpt**: Brief summary
   - **Category**, **Tags**, **Chapter**: Organize your post
   - **Date**: Publication date
   - **Form**: `longform` or `shortform`
   - **Published**: Toggle to publish
6. Click **Save**

### Uploading Images

1. In post content, click image button
2. Upload from computer or select from library
3. Directus uploads to Supabase Storage
4. Image URL is inserted into content

### Updating Site Configuration

1. Go to **Content** > **Site Config**
2. Find `pond_config` row
3. Click to edit
4. Modify JSON value:
   ```json
   {
     "title": "3rd Space",
     "subtitle": "Pond",
     "description": "Updated description",
     "author": "Your Name",
     "email": "your@email.com",
     "url": "https://perakasem.co/pond"
   }
   ```
5. Click **Save**

---

## Deployment

### Update SvelteKit App

1. **Switch to Supabase-based posts:**

   ```typescript
   // src/routes/(pond)/pond/+page.server.ts
   // Change from:
   import { getPosts } from '$lib/server/posts';

   // To:
   import { getPosts } from '$lib/server/posts-supabase';
   ```

2. **Do this for all files using post functions:**
   - `src/routes/(pond)/pond/+page.server.ts`
   - `src/routes/(pond)/pond/[slug]/+page.server.ts`
   - `src/routes/(pond)/pond/archive/+page.server.ts`
   - `src/routes/api/posts/+server.ts`
   - `src/routes/rss.xml/+server.ts`

3. **Update post rendering:**

   ```svelte
   <!-- src/routes/(pond)/pond/[slug]/+page.svelte -->
   <script lang="ts">
     export let data;

     // Content now comes from database
     const { meta, slug, previousPost, nextPost } = data;
   </script>

   <!-- Render content -->
   <div class="content">
     {@html meta.content}
   </div>
   ```

4. **Add environment variables to hosting:**

   **Vercel/Netlify:**
   ```
   PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

### Deploy Directus

**Directus Cloud:**
- Already hosted, just use provided URL

**Self-hosted:**

1. **Option A: Railway.app**
   - Connect GitHub repo with `docker-compose.yml`
   - Add environment variables
   - Deploy

2. **Option B: DigitalOcean App Platform**
   - Create new app from Docker image: `directus/directus`
   - Configure environment variables
   - Connect to Supabase

3. **Option C: VPS (Ubuntu)**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com | sh

   # Clone your config
   git clone your-directus-config-repo
   cd directus-config

   # Start Directus
   docker-compose up -d

   # Set up Nginx reverse proxy
   # SSL with Let's Encrypt
   ```

---

## Content Page Strategy

For content-heavy pages like Bio, Resume, etc. that have interactive elements:

### Approach 1: Structured JSON Content (Recommended)

Store page content as JSON blocks in `content_pages` table:

```json
{
  "desktop": [
    {
      "type": "text",
      "content": "I'm a photographer and designer...",
      "className": "serif-typo-body"
    },
    {
      "type": "button",
      "label": "View Photography",
      "href": "/photography",
      "variant": "secondary"
    },
    {
      "type": "grid",
      "columns": 2,
      "items": [
        { "type": "text", "content": "Column 1" },
        { "type": "text", "content": "Column 2" }
      ]
    }
  ],
  "mobile": [
    // Different layout for mobile
  ]
}
```

**Pros:**
- Full control over layout
- Different mobile/desktop layouts
- Can include buttons, components
- Version controlled

**Cons:**
- Requires custom Directus interface
- More complex to edit

### Approach 2: Markdown with Shortcodes

Use markdown with custom shortcodes:

```markdown
# About Me

I'm a photographer...

[button href="/photography" variant="secondary"]View Photography[/button]

[grid columns="2"]
  [column]
    Content left
  [/column]
  [column]
    Content right
  [/column]
[/grid]
```

Parse shortcodes in SvelteKit to render components.

### Approach 3: Hybrid (Recommended for Bio)

Keep layout in code, make text content editable:

```typescript
// content_pages table
{
  slug: "bio",
  content: {
    intro: "I'm a photographer...",
    sections: [
      {
        title: "Photography",
        description: "...",
        buttonLabel: "View Work",
        buttonHref: "/photography"
      }
    ]
  }
}
```

Then in Svelte:

```svelte
<script>
  export let content;
</script>

<!-- Layout stays in code -->
<div class="bio-layout">
  <p class="serif-typo-body">{content.intro}</p>

  {#each content.sections as section}
    <section>
      <h2>{section.title}</h2>
      <p>{section.description}</p>
      <a href={section.buttonHref} class="button-secondary">
        {section.buttonLabel}
      </a>
    </section>
  {/each}
</div>
```

**Benefits:**
- Layout controlled by developer
- Content editable by non-technical users
- Responsive behavior in code
- Simple to edit in CMS

---

## Security Considerations

### Row Level Security (RLS)

Supabase RLS policies are already set up in the schema:

- ✅ **Public read** for published content
- ✅ **Admin write** for content management

### API Key Security

- ✅ Use **anon/public key** in frontend (safe to expose)
- ❌ **Never** expose **service role key** in frontend
- ✅ Keep Directus admin credentials secure

### Content Sanitization

When rendering user-generated content:

```typescript
import DOMPurify from 'isomorphic-dompurify';

// Sanitize HTML before rendering
const cleanContent = DOMPurify.sanitize(post.content);
```

---

## Troubleshooting

### Posts not showing in Directus

1. Check Directus can connect to Supabase
2. Verify tables exist in Supabase
3. Refresh Directus schema: Settings > Data Model > Refresh

### Images not uploading

1. Check Supabase storage bucket is public
2. Verify CORS settings in Supabase
3. Check Directus has storage configured

### Content not updating in app

1. Verify environment variables are set
2. Check Supabase RLS policies
3. Clear SvelteKit server cache
4. Check browser console for errors

---

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Run database schema
3. ✅ Configure Directus
4. ✅ Migrate existing posts
5. ✅ Test creating posts in Directus
6. ✅ Update SvelteKit to use Supabase
7. ✅ Deploy and test
8. 🎉 Start writing content!

---

**Questions?** Check the [Directus Docs](https://docs.directus.io) and [Supabase Docs](https://supabase.com/docs)
