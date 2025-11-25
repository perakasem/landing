# CLAUDE.md - AI Assistant Guide

> **Last Updated:** 2025-11-19 (CMS Integration Complete)
> **Purpose:** Comprehensive guide for AI assistants working on this SvelteKit portfolio and blog codebase
> **Recent Changes:** Complete CMS integration with Directus + Supabase, documentation consolidation

---

## Quick Reference

**Project Type:** Personal portfolio + blog ("3rd Space/Pond")
**Framework:** SvelteKit 2 + Svelte 5
**CMS:** Directus (headless)
**Database:** Supabase (PostgreSQL)
**Hosting:** Vercel (frontend) + Render/Railway (Directus)

**URLs:**

- Production: https://perakasem.com
- Blog: https://perakasem.com/pond

**Key Documentation:**

- `ARCHITECTURE.md` - Complete technical reference
- `CMS-GUIDE.md` - CMS setup and usage
- `README.md` - Project overview
- This file - AI assistant working guide

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [CMS Architecture](#cms-architecture)
3. [Technology Stack](#technology-stack)
4. [Directory Structure](#directory-structure)
5. [Development Workflows](#development-workflows)
6. [Code Conventions](#code-conventions)
7. [Architecture Patterns](#architecture-patterns)
8. [Content Management](#content-management)
9. [Styling System](#styling-system)
10. [Common Tasks](#common-tasks)
11. [Troubleshooting](#troubleshooting)
12. [Important Files Reference](#important-files-reference)

---

## Project Overview

### What This Is

A personal portfolio and blog website with headless CMS integration:

- **Portfolio Section** - 2/3-1/3 split layout with side image panel
- **Blog ("Pond")** - CMS-managed articles with categories, tags, archive
- **Dark Mode** - localStorage-persisted theme system
- **Responsive** - Mobile-first design (breakpoint: 640px/700px)
- **Typography** - Three custom typefaces (serif, sans, mono)
- **CMS-Driven** - Content managed via Directus, no code deployments needed

### Key Features

✅ **Content managed via CMS** - Non-technical users can create/edit posts
✅ **Database-driven** - Posts and config stored in Supabase PostgreSQL
✅ **Type-safe** - Full TypeScript with generated database types
✅ **SSR + Edge** - Server-side rendering on Vercel edge network
✅ **Markdown support** - Rich text editing with GFM
✅ **Asset preloading** - Custom loading screen with progress
✅ **5-minute config cache** - Fast performance with auto-updates

---

## CMS Architecture

### System Overview

```
Content Flow:
Directus CMS (Render/Railway)
    ↓ writes to
Supabase PostgreSQL
    ↓ reads from
SvelteKit App (Vercel)
    ↓ serves to
Users
```

### Components

| Component     | Purpose            | Technology   | Hosting        |
| ------------- | ------------------ | ------------ | -------------- |
| **CMS Admin** | Content editing UI | Directus 10+ | Render/Railway |
| **Database**  | Data storage       | PostgreSQL   | Supabase       |
| **Frontend**  | User-facing site   | SvelteKit 2  | Vercel         |

### Why This Architecture?

**Before:** Markdown files → Git commits → Vercel deploys

- ❌ Technical knowledge required
- ❌ Slow (deploy for every change)
- ❌ No draft workflow

**After:** Directus UI → Database → App reads

- ✅ Non-technical friendly
- ✅ Instant updates (5-min cache)
- ✅ Draft/publish workflow
- ✅ Image uploads
- ✅ Structured content

### Data Model

**Tables:**

1. **posts** - Blog articles with metadata
2. **site_config** - Site-wide configuration (singleton)

**Key Pattern:** JSONB arrays for Directus Tags interface

```sql
-- Database stores:
form: ["longform"]
category: ["documentary"]
tags: ["tag1", "tag2", ...]

-- App receives (via arrayToString helper):
form: "longform"
category: "documentary"
tags: ["tag1", "tag2", ...]  # Arrays stay arrays
```

---

## Technology Stack

### Core Framework

- **SvelteKit 2.16.0** - Full-stack framework with SSR
- **Svelte 5.0.0** - Reactive UI with runes ($state, $derived, $effect)
- **TypeScript 5.0.0** - Type safety across stack
- **Vite 6.0.0** - Build tool and dev server

### Styling

- **Tailwind CSS 4.0.6** - Utility-first CSS
- **@tailwindcss/vite** - Vite plugin for JIT compilation
- **PostCSS + Autoprefixer** - CSS processing

### Content & Data

- **Supabase Client 2.83.0** - PostgreSQL client
- **Directus 10+** - Headless CMS
- **mdsvex 0.12.3** - Markdown processing (legacy)

### Development Tools

- **Prettier 3.4.2** - Code formatting (tabs, single quotes)
- **svelte-check** - Type checking
- **publint** - Package validation

---

## Directory Structure

```
/home/user/landing/
├── src/
│   ├── routes/                           # File-based routing
│   │   ├── (landing)/                    # Portfolio layout group
│   │   │   ├── +layout.svelte            # 2/3-1/3 split layout
│   │   │   └── (various pages)
│   │   ├── (pond)/                       # Blog layout group
│   │   │   └── pond/
│   │   │       ├── +layout@.svelte       # Layout reset
│   │   │       ├── +layout.server.ts     # ⭐ Loads site config
│   │   │       ├── +page.server.ts       # ⭐ Loads posts from DB
│   │   │       ├── [slug]/+page.server.ts # ⭐ Loads individual post
│   │   │       └── archive/+page.server.ts # ⭐ Loads all posts
│   │   ├── api/posts/+server.ts          # JSON API
│   │   └── rss.xml/+server.ts            # RSS feed
│   ├── lib/
│   │   ├── server/                       # Server-only code
│   │   │   ├── posts-supabase.ts         # ⭐ Post loading (active)
│   │   │   ├── config.ts                 # ⭐ Config loading (active)
│   │   │   └── posts.ts                  # Legacy file-based (deprecated)
│   │   ├── stores/                       # Client state
│   │   │   ├── themeStore.ts
│   │   │   ├── sideImageStore.ts
│   │   │   └── attributionStore.ts
│   │   ├── types/
│   │   │   └── database.ts               # ⭐ Generated Supabase types
│   │   ├── supabase.ts                   # ⭐ Shared Supabase client
│   │   ├── types.ts                      # App types (Post, etc.)
│   │   ├── utils.ts                      # Helper functions
│   │   └── pond.config.ts                # Legacy config (fallback only)
│   ├── components/                       # Reusable UI
│   │   ├── BackToTopButton.svelte
│   │   ├── PostPreview.svelte
│   │   ├── ScrollProgress.svelte
│   │   └── (others)
│   ├── posts/                            # Legacy markdown files
│   ├── app.html                          # HTML shell
│   ├── app.css                           # Global styles
│   └── tailwind.css                      # Tailwind directives
├── static/                               # Static assets
├── scripts/                              # Utility scripts
│   ├── migrate-posts-to-supabase.ts      # Migration script
│   └── health-check.ts                   # Pre-deployment validation
├── database/                             # ⭐ Database schemas
│   ├── schema.sql                        # Complete DB schema
│   ├── create-site-config-table.sql      # Standalone site_config table
│   ├── reset-directus-metadata.sql       # Directus cache troubleshooting
│   └── README.md                         # Database documentation
├── ARCHITECTURE.md                       # ⭐ Technical reference
├── CMS-GUIDE.md                          # ⭐ CMS documentation
├── CLAUDE.md                             # This file
├── README.md                             # Project overview
├── svelte.config.js
├── vite.config.ts
├── tailwind.config.ts
└── package.json

⭐ = Files critical to CMS architecture
```

---

## Development Workflows

### Starting Development

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run check        # Type checking
npm run format       # Format code
```

### Working with CMS Content

**Local Development:**

1. App connects to production Supabase/Directus
2. Changes in Directus appear immediately on localhost
3. No need to restart dev server

**Environment Variables Required:**

```bash
# .env (or .env.local)
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJ...
```

### Building for Production

```bash
npm run build        # Runs: vite build && svelte-kit sync
npm run preview      # Preview production build locally
```

**Deployment:** Automatic via Vercel on push to main branch

---

## Code Conventions

### Formatting (Prettier)

```json
{
	"useTabs": true,
	"singleQuote": true,
	"trailingComma": "none",
	"printWidth": 100
}
```

Run: `npm run format`

### File Naming

- **Components:** PascalCase (e.g., `LoadingScreen.svelte`)
- **Routes:** kebab-case + SvelteKit conventions (e.g., `+page.svelte`)
- **Utilities:** camelCase (e.g., `utils.ts`, `posts-supabase.ts`)
- **Types:** camelCase with `.ts` (e.g., `database.ts`)

### Import Conventions

```typescript
// Use $lib alias
import { getPosts } from '$lib/server/posts-supabase';
import { db } from '$lib/supabase';
import type { Post } from '$lib/types';

// External deps
import { writable } from 'svelte/store';
```

### TypeScript

- **Strict mode:** Enabled
- **Target:** ES2020
- **Paths:** `$lib/*` → `src/lib/*`
- **Type definitions:** `src/lib/types.ts` and `src/lib/types/database.ts`

---

## Architecture Patterns

### SvelteKit Routing

**Layout Groups:** Organize without affecting URLs

```
(landing)/  → Portfolio pages with side panel layout
(pond)/     → Blog pages with custom layout
```

**Layout Reset:** `@` syntax

```
+layout@.svelte  → Breaks out of parent layouts
```

**Server Load Functions:**

```typescript
// +page.server.ts or +layout.server.ts
export const load: PageServerLoad = async () => {
	const data = await fetchFromDatabase();
	return { data };
};
```

### CMS Data Loading

**Pattern used throughout blog:**

```typescript
// routes/pond/+layout.server.ts
import { getCachedSiteConfig } from '$lib/server/config';

export const load: LayoutServerLoad = async () => {
	const config = await getCachedSiteConfig(); // 5-min cache
	return { config };
};

// routes/pond/+page.server.ts
import { getPosts } from '$lib/server/posts-supabase';

export const load: PageServerLoad = async () => {
	const posts = await getPosts(); // Always fresh
	return { posts };
};
```

**Key Files:**

1. **`src/lib/supabase.ts`** - Shared Supabase client

   ```typescript
   export const supabase = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

   export const db = {
   	posts: () => supabase.from('posts'),
   	siteConfig: () => supabase.from('site_config')
   };
   ```

2. **`src/lib/server/posts-supabase.ts`** - Post queries

   ```typescript
   export async function getPosts(): Promise<Post[]> {
   	const { data, error } = await db
   		.posts()
   		.select('*')
   		.eq('published', true)
   		.order('date', { ascending: false });

   	return (data || []).map((row) => ({
   		...row,
   		form: arrayToString(row.form), // ["longform"] → "longform"
   		category: arrayToString(row.category),
   		chapter: arrayToString(row.chapter)
   	}));
   }
   ```

3. **`src/lib/server/config.ts`** - Config loading with cache

   ```typescript
   let cachedConfig: SiteConfig | null = null;
   let cacheTimestamp: number = 0;
   const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

   export async function getCachedSiteConfig() {
   	if (cachedConfig && Date.now() - cacheTimestamp < CACHE_TTL) {
   		return cachedConfig;
   	}
   	cachedConfig = await getSiteConfig();
   	cacheTimestamp = Date.now();
   	return cachedConfig;
   }
   ```

### Dynamic Routes

```
routes/pond/[slug]/+page.svelte
```

Matches any slug (e.g., `/pond/shorebirds`)

```typescript
export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;
	const post = await getPostBySlug(slug);
	return { post };
};
```

---

## Content Management

### How Content Works

**Old Way (deprecated):**

```
Markdown files (src/posts/*.md)
    ↓
Git commit + push
    ↓
Vercel deploy
    ↓
Website updated
```

**New Way (current):**

```
Directus CMS
    ↓ (instant)
Supabase Database
    ↓ (on page load)
Website reads + displays
    ↓ (5-min cache for config)
```

### Creating Content

**Via Directus:**

1. Login to Directus admin
2. Go to Content → Posts
3. Click "Create Item"
4. Fill fields, save as draft
5. Publish when ready

**Programmatically:**

```typescript
import { db } from '$lib/supabase';

await db.posts().insert({
	slug: 'my-post',
	title: 'My Post',
	content: '# Hello',
	published: true
	// ... other fields
});
```

### Post Schema

See `database/schema.sql` for complete schema.

**Key fields:**

- `slug` (TEXT, unique) - URL identifier
- `title` (TEXT) - Post title
- `content` (TEXT) - Markdown content
- `form` (JSONB) - ["longform"] or ["shortform"]
- `category` (JSONB) - ["documentary"], etc.
- `tags` (JSONB) - ["tag1", "tag2"]
- `published` (BOOLEAN) - Visibility
- `date` (DATE) - Publication date

### Available Helper Functions

**From `posts-supabase.ts`:**

```typescript
getPosts(); // All published posts
getAllPosts(); // Including drafts
getPostBySlug(slug); // Single post
getNavigationPosts(slug); // Previous/next posts
```

**From `config.ts`:**

```typescript
getSiteConfig(); // Fetch config (no cache)
getCachedSiteConfig(); // Fetch config (5-min cache)
clearConfigCache(); // Clear cache
```

---

## Styling System

### Tailwind Configuration

**File:** `tailwind.config.ts`

```typescript
export default {
	darkMode: 'class', // .dark on <html>
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				dark: '#151515',
				'off-white': '#DEDCDB',
				'pond-blue': '#5468FF',
				pond: '#2E2E2E'
			}
		}
	}
};
```

### Typography Classes

**Location:** `src/app.css`

**Convention:** `{typeface}-typo-{variant}`

| Class                   | Font                 | Size      | Usage            |
| ----------------------- | -------------------- | --------- | ---------------- |
| `.serif-typo-h1`        | Hedvig Letters Serif | 96px      | Desktop headings |
| `.serif-typo-h1-mobile` | Hedvig Letters Serif | 64px      | Mobile headings  |
| `.serif-typo-paragraph` | Hedvig Letters Serif | 24px      | Body text        |
| `.sans-typo-title`      | Instrument Sans      | 42px, 300 | Titles           |
| `.mono-typo-nav`        | Inconsolata          | 16px      | Navigation       |

### Blog Content Styles

**Global classes for markdown:**

- `.content` - Desktop blog styling
- `.content-mobile` - Mobile blog styling

Includes all markdown elements (headings, lists, code, tables, etc.)

### Reusable UI Classes

- `.button-secondary` - Standard button
- `.button-secondary-compact` - Compact button
- `.button-secondary-accent` - Accent button
- `.post-preview` - Post title/subtitle with hover

### Dark Mode

**Implementation:**

```html
<!-- app.html -->
<script>
	const theme = localStorage.getItem('theme') ?? 'dark';
	document.documentElement.classList.toggle('dark', theme === 'dark');
</script>
```

**Toggle via store:**

```typescript
import { themeStore } from '$lib/stores/themeStore';
themeStore.update((t) => (t === 'dark' ? 'light' : 'dark'));
```

---

## Common Tasks

### Adding a New Blog Post (via CMS)

1. Go to Directus → Content → Posts
2. Click "Create Item"
3. Fill in:
   - Title, subtitle, content
   - Form (longform/shortform)
   - Category, tags, chapter
   - Date, excerpt
4. Save as draft (`published: false`)
5. When ready: Batch Edit → Set `published: true`

### Updating Site Config

1. Go to Directus → Content → Site Config
2. Edit fields directly (it's a singleton)
3. Save
4. Changes appear on site within 5 minutes

### Adding a New Route

```bash
# Create file
src/routes/(landing)/my-page/+page.svelte
```

```svelte
<script lang="ts">
	// Page logic
</script>

<div>
	<h1 class="serif-typo-h1">My Page</h1>
</div>
```

### Adding a Component

```bash
# Create file
src/components/MyComponent.svelte
```

```svelte
<script lang="ts">
	let {
		title,
		items
	}: {
		title: string;
		items: string[];
	} = $props();
</script>

<div>
	<h2>{title}</h2>
	<ul>
		{#each items as item}
			<li>{item}</li>
		{/each}
	</ul>
</div>
```

### Database Schema Changes

1. **Modify schema:** Edit `database/schema.sql`
2. **Run in Supabase:** SQL Editor → Execute
3. **Update types:**
   ```bash
   npx supabase gen types typescript \
       --project-id YOUR_PROJECT_ID \
       > src/lib/types/database.ts
   ```
4. **Update code:** Adjust queries in `posts-supabase.ts`
5. **Update Directus:** Clear cached metadata if needed

### Migrating Markdown to Database

```bash
cd scripts
npx ts-node migrate-posts-to-supabase.ts
```

Requires `SUPABASE_SERVICE_ROLE_KEY` environment variable.

---

## Troubleshooting

### Posts Not Showing

**Checklist:**

1. ✅ Post has `published: true`
2. ✅ Date is not in future
3. ✅ Chapter matches filter (on /pond)
4. ✅ Check /pond/archive to see all posts

**Debug:**

```typescript
// Add logging
const posts = await getPosts();
console.log('Loaded posts:', posts.length);
```

### Config Not Updating

**Cause:** 5-minute cache

**Solutions:**

1. Wait 5 minutes
2. Redeploy Vercel (clears cache)
3. Clear cache manually:
   ```typescript
   import { clearConfigCache } from '$lib/server/config';
   clearConfigCache();
   ```

### Directus Shows Wrong Schema

**Cause:** Cached metadata

**Fix:**

```sql
-- In Supabase SQL Editor
DELETE FROM directus_fields WHERE collection = 'posts';
DELETE FROM directus_collections WHERE collection = 'posts';
```

Then refresh Directus.

### Build Fails: "supabaseUrl is required"

**Cause:** Environment variables not set

**Fix:** Add to Vercel environment variables:

```
PUBLIC_SUPABASE_URL=...
PUBLIC_SUPABASE_ANON_KEY=...
```

### TypeScript Errors

```bash
rm -rf .svelte-kit
npm run check
```

---

## Important Files Reference

### Configuration Files

| File                 | Purpose                   |
| -------------------- | ------------------------- |
| `svelte.config.js`   | SvelteKit + mdsvex config |
| `vite.config.ts`     | Build config              |
| `tailwind.config.ts` | Styling config            |
| `tsconfig.json`      | TypeScript config         |
| `.prettierrc`        | Code formatting rules     |

### Core Application Files

| File                               | Purpose                   |
| ---------------------------------- | ------------------------- |
| `src/lib/supabase.ts`              | ⭐ Shared Supabase client |
| `src/lib/server/posts-supabase.ts` | ⭐ Post loading from DB   |
| `src/lib/server/config.ts`         | ⭐ Config loading from DB |
| `src/lib/types/database.ts`        | ⭐ Generated DB types     |
| `src/lib/types.ts`                 | App types                 |
| `src/lib/utils.ts`                 | Helper functions          |
| `src/app.css`                      | Global styles             |

### Database Files

| File                                               | Purpose               |
| -------------------------------------------------- | --------------------- |
| `database/schema.sql`                              | ⭐ Complete DB schema |
| `database/create-site-config-table.sql`            | Config table schema   |
| `database/reset-directus-metadata.sql` | Troubleshooting       |

### Documentation

| File              | Purpose             | Audience       |
| ----------------- | ------------------- | -------------- |
| `CLAUDE.md`       | This file           | AI assistants  |
| `ARCHITECTURE.md` | Technical deep-dive | Developers     |
| `CMS-GUIDE.md`    | Setup & usage       | Admins/editors |
| `README.md`       | Project overview    | Everyone       |

---

## Git Workflow

### Branch Strategy

- `main` - Production branch (auto-deploys to Vercel)
- Feature branches as needed

### Commit Guidelines

```bash
git add .
git commit -m "type: description"
git push
```

**Types:** feat, fix, docs, style, refactor, test, chore

---

## Performance Notes

- **Site Config:** 5-minute server cache
- **Posts:** Always fresh from DB
- **Static Assets:** CDN cached (Vercel edge)
- **SSR:** Every page request
- **Code Splitting:** Automatic per route

---

## Security

- **RLS:** PostgreSQL row-level security on all tables
- **Public Keys:** Only anon key exposed (read-only via RLS)
- **Service Role:** Only used in migration scripts (never exposed)
- **HTTPS:** Enforced in production

---

## Key Differences from Standard SvelteKit

1. **CMS-Driven Content:** Not markdown files, database-driven
2. **JSONB Arrays:** Special pattern for Directus compatibility
3. **Config Caching:** 5-minute TTL for performance
4. **Layout Reset:** `@` syntax used in blog section
5. **Shared DB Client:** One client for all queries
6. **Type Generation:** Types generated from Supabase schema

---

## When Working on This Project

**Always:**

- ✅ Use `posts-supabase.ts` (not `posts.ts`)
- ✅ Use `config.ts` from database (not `pond.config.ts`)
- ✅ Import from `$lib/supabase` for DB queries
- ✅ Run `npm run format` before committing
- ✅ Check `npm run check` passes

**Never:**

- ❌ Hardcode content in components
- ❌ Create new Supabase clients (use shared one)
- ❌ Modify database without updating types
- ❌ Skip type checking

**Remember:**

- Content changes happen in Directus (not code)
- Database is source of truth
- Config has 5-minute cache
- Posts are always fresh

---

**Last Updated:** 2025-11-19
**Version:** 2.0.0 (CMS Integration Complete)
**Status:** Production-ready with full CMS
