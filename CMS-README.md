# 📝 CMS Integration: Directus + Supabase

## Overview

This project now supports a **headless CMS** setup using **Directus** and **Supabase**, allowing non-technical users to manage blog posts and content pages without pushing code to GitHub.

## 📁 File Structure

```
landing/
├── supabase-schema.sql           # Database schema for Supabase
├── directus.config.yaml          # Directus configuration reference
├── .env.example                  # Environment variable template
│
├── scripts/
│   └── migrate-posts-to-supabase.ts  # Migration script
│
├── src/
│   ├── lib/
│   │   ├── supabase.ts                  # Supabase client
│   │   ├── types/database.ts            # Database type definitions
│   │   └── server/
│   │       ├── posts.ts                 # File-based (original)
│   │       └── posts-supabase.ts        # Database-based (CMS)
│   └── components/
│       └── ContentRenderer.svelte       # Renders CMS content blocks
│
└── docs/
    ├── CMS-QUICK-START.md        # 5-minute setup guide
    ├── CMS-SETUP.md              # Detailed setup instructions
    └── CONTENT-PAGE-STRATEGY.md  # Content page management guide
```

## 🎯 Features

### Blog (POND) Management
- ✅ Create/edit/delete posts via Directus UI
- ✅ Rich text editor with markdown support
- ✅ Image upload to Supabase Storage
- ✅ Draft/publish workflow
- ✅ Tag and category management
- ✅ Featured images
- ✅ SEO metadata

### Site Configuration
- ✅ Edit pond config without code changes
- ✅ Update site metadata
- ✅ Manage footer content

### Content Pages (Bio, Resume, etc.)
- ✅ Structured content blocks
- ✅ Different mobile/desktop layouts
- ✅ Interactive elements (buttons, grids)
- ✅ Component embedding

## 🚀 Quick Start

See **[CMS-QUICK-START.md](./CMS-QUICK-START.md)** for a 5-minute setup guide.

## 📚 Documentation

- **[CMS-QUICK-START.md](./CMS-QUICK-START.md)** - Get started in 5 minutes
- **[CMS-SETUP.md](./CMS-SETUP.md)** - Detailed setup and configuration
- **[CONTENT-PAGE-STRATEGY.md](./CONTENT-PAGE-STRATEGY.md)** - Managing content pages

## 🔄 Switching to CMS

### Current Setup (File-based)
Posts are stored as markdown files in `src/posts/`

### CMS Setup (Database-based)
Posts are stored in Supabase and managed via Directus

### Migration Steps

1. **Install dependencies:**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Set up Supabase** (see CMS-SETUP.md)

3. **Migrate posts:**
   ```bash
   npx tsx scripts/migrate-posts-to-supabase.ts
   ```

4. **Update imports:**
   ```typescript
   // Change this:
   import { getPosts } from '$lib/server/posts';

   // To this:
   import { getPosts } from '$lib/server/posts-supabase';
   ```

5. **Deploy with env vars:**
   ```bash
   PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=your-key
   ```

## 🔧 Maintenance Mode

You can run **both systems simultaneously**:

- **File-based**: Keep using markdown files (current setup)
- **CMS-based**: Switch to database (new setup)

Simply change the import path to switch between them.

## 🆘 Support

- **Issues**: Check troubleshooting section in CMS-SETUP.md
- **Directus Docs**: https://docs.directus.io
- **Supabase Docs**: https://supabase.com/docs

## 📝 License

Same as main project
