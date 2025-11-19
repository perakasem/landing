# Architecture Documentation

**Complete technical reference for the codebase**

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Routing Architecture](#routing-architecture)
5. [Data Flow](#data-flow)
6. [Database Schema](#database-schema)
7. [Component Architecture](#component-architecture)
8. [Styling System](#styling-system)
9. [State Management](#state-management)
10. [Build & Deployment](#build--deployment)

---

## System Overview

### Architecture Pattern

**JAMstack** (JavaScript, APIs, Markup)

- **Frontend:** SvelteKit (SSR + SSG)
- **Backend:** Serverless functions (SvelteKit API routes)
- **Database:** Supabase (PostgreSQL)
- **CMS:** Directus (headless)
- **Hosting:** Vercel (edge network)

### High-Level Data Flow

```
User Browser
    ↓
Vercel Edge Network (CDN)
    ↓
SvelteKit App (SSR)
    ↓
Supabase Database ←→ Directus CMS
```

### Key Characteristics

- **Server-Side Rendering (SSR):** Pages rendered on server for SEO
- **Static Generation:** Some pages pre-built at deploy time
- **Edge Caching:** Content cached globally for speed
- **Headless CMS:** Content managed separately from code
- **Type-Safe:** Full TypeScript integration
- **Component-Based:** Reusable Svelte components

---

## Technology Stack

### Core Framework

| Technology     | Version | Purpose                            |
| -------------- | ------- | ---------------------------------- |
| **SvelteKit**  | 2.16.0  | Full-stack web framework           |
| **Svelte**     | 5.0.0   | Reactive UI framework (with runes) |
| **TypeScript** | 5.0.0   | Type safety                        |
| **Vite**       | 6.0.0   | Build tool & dev server            |

### Styling

| Technology            | Version | Purpose               |
| --------------------- | ------- | --------------------- |
| **Tailwind CSS**      | 4.0.6   | Utility-first CSS     |
| **@tailwindcss/vite** | 4.0.6   | Vite integration      |
| **PostCSS**           | 8.5.2   | CSS processing        |
| **Autoprefixer**      | 10.4.20 | Browser compatibility |

### Content Processing

| Technology           | Version | Purpose                  |
| -------------------- | ------- | ------------------------ |
| **mdsvex**           | 0.12.3  | Markdown → Svelte        |
| **remark-gfm**       | 4.0.1   | GitHub Flavored Markdown |
| **remark-footnotes** | 2.0     | Footnote support         |

### Backend Services

| Service      | Purpose             | Hosting        |
| ------------ | ------------------- | -------------- |
| **Supabase** | PostgreSQL database | Supabase Cloud |
| **Directus** | CMS admin UI        | Render/Railway |
| **Vercel**   | App hosting         | Vercel Edge    |

### Development Tools

| Tool             | Purpose            |
| ---------------- | ------------------ |
| **Prettier**     | Code formatting    |
| **svelte-check** | Type checking      |
| **publint**      | Package validation |

---

## Directory Structure

```
/home/user/landing/
│
├── src/                                # Source code
│   ├── routes/                         # File-based routing
│   │   ├── (landing)/                  # Layout group: Portfolio
│   │   │   ├── +layout.svelte          # 2/3-1/3 split layout
│   │   │   ├── +page.svelte            # Home page
│   │   │   ├── bio/                    # About page
│   │   │   ├── resume/                 # Resume page
│   │   │   └── now/                    # Now page
│   │   │
│   │   ├── (pond)/                     # Layout group: Blog
│   │   │   ├── +layout.svelte          # Blog wrapper (minimal)
│   │   │   └── pond/                   # Blog routes
│   │   │       ├── +layout@.svelte     # Reset layout (full custom)
│   │   │       ├── +layout.server.ts   # Load site config
│   │   │       ├── +page.svelte        # Blog home/listing
│   │   │       ├── +page.server.ts     # Load posts
│   │   │       ├── [slug]/             # Dynamic post routes
│   │   │       │   ├── +page.svelte    # Post rendering
│   │   │       │   └── +page.server.ts # Load post data
│   │   │       └── archive/            # Archive page
│   │   │           ├── +page.svelte    # Archive listing
│   │   │           └── +page.server.ts # Load all posts
│   │   │
│   │   ├── api/                        # API endpoints
│   │   │   └── posts/+server.ts        # JSON API for posts
│   │   ├── rss.xml/+server.ts          # RSS feed
│   │   ├── +layout.svelte              # Root layout
│   │   └── +error.svelte               # Error page
│   │
│   ├── lib/                            # Shared library code
│   │   ├── server/                     # Server-only code
│   │   │   ├── posts-supabase.ts       # Post loading from DB
│   │   │   └── config.ts               # Config loading from DB
│   │   ├── stores/                     # Svelte stores
│   │   │   ├── themeStore.ts           # Dark/light mode
│   │   │   ├── sideImageStore.ts       # Side panel image
│   │   │   └── attributionStore.ts     # Attribution styling
│   │   ├── types/                      # TypeScript definitions
│   │   │   └── database.ts             # Supabase types
│   │   ├── supabase.ts                 # Supabase client
│   │   ├── types.ts                    # App types
│   │   ├── utils.ts                    # Utility functions
│   │   └── pond.config.ts              # Legacy config (fallback)
│   │
│   ├── components/                     # Reusable components
│   │   ├── LoadingScreen.svelte        # Asset preloader
│   │   ├── MenuContent.svelte          # Navigation menu
│   │   ├── ScrollProgress.svelte       # Reading progress
│   │   ├── ThemeToggle.svelte          # Dark mode toggle
│   │   ├── BackToTopButton.svelte      # Scroll to top
│   │   └── PostPreview.svelte          # Post title/subtitle
│   │
│   ├── posts/                          # Legacy markdown posts
│   │   └── *.md                        # (Now loaded from DB)
│   │
│   ├── app.html                        # HTML shell
│   ├── app.css                         # Global styles
│   ├── tailwind.css                    # Tailwind directives
│   └── app.d.ts                        # Global types
│
├── static/                             # Static assets
│   ├── favicon.ico
│   └── *.jpg, *.png                    # Images
│
├── scripts/                            # Migration & utility scripts
│   ├── migrate-posts-to-supabase.ts    # Markdown → DB migration
│   └── health-check.ts                 # Pre-deployment validation
│
├── database/                           # Database schemas & scripts
│   ├── schema.sql                      # Complete DB schema (posts + site_config)
│   ├── create-site-config-table.sql    # Standalone site_config table
│   ├── reset-directus-metadata.sql     # Troubleshooting Directus cache
│   └── README.md                       # Database documentation
│
├── ARCHITECTURE.md                     # This file
├── CMS-GUIDE.md                        # CMS setup & usage
├── CLAUDE.md                           # AI assistant guide
├── README.md                           # Project overview
│
├── svelte.config.js                    # SvelteKit config
├── vite.config.ts                      # Vite config
├── tailwind.config.ts                  # Tailwind config
├── mdsvex.config.js                    # Markdown config
├── tsconfig.json                       # TypeScript config
├── .prettierrc                         # Code formatting
└── package.json                        # Dependencies

```

---

## Routing Architecture

### SvelteKit File-Based Routing

Routes are defined by the file structure in `src/routes/`:

```
src/routes/
├── +page.svelte          → /
├── bio/+page.svelte      → /bio
└── pond/
    ├── +page.svelte      → /pond
    ├── [slug]/           → /pond/:slug (dynamic)
    └── archive/          → /pond/archive
```

### Layout Groups

**Syntax:** `(groupName)`

**Purpose:** Organize routes without affecting URLs

```
src/routes/
├── (landing)/            # Portfolio section
│   ├── +layout.svelte    # 2/3-1/3 split layout
│   └── +page.svelte      # Home: /
│
└── (pond)/               # Blog section
    └── pond/
        ├── +layout@.svelte  # Layout reset (@)
        └── +page.svelte     # Blog: /pond
```

**Key:**

- **(landing)** - Portfolio pages with side image panel
- **(pond)** - Blog pages with custom full-height layout
- **@** syntax - Resets layout (breaks out of parent)

### Server Load Functions

**Pattern:** `+page.server.ts` or `+layout.server.ts`

**Purpose:** Load data on server before rendering

```typescript
// routes/pond/+page.server.ts
export const load: PageServerLoad = async () => {
	const posts = await getPosts();
	return { posts };
};
```

**Runs on:**

- ✅ Server (always)
- ❌ Browser (never)

**Used for:**

- Database queries
- API calls
- Authentication checks

### Dynamic Routes

**Pattern:** `[paramName]`

```
routes/pond/[slug]/+page.svelte
```

**Matches:**

- `/pond/shorebirds`
- `/pond/fishing-cats`
- `/pond/any-slug-here`

**Access param:**

```typescript
export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;
	const post = await getPostBySlug(slug);
	return { post };
};
```

### Layout Reset Pattern

**File:** `+layout@.svelte`

**The @ syntax:**

- Breaks out of parent layouts
- Creates completely custom layout
- Used for blog pages to avoid portfolio layout

**Example:**

```
(landing)/+layout.svelte      # 2/3-1/3 layout
    ↓ normally inherits
(pond)/pond/+layout@.svelte   # @ resets (no inheritance)
```

**Corresponding server file:**

```
+layout.server.ts  # Not +layout@.server.ts (@ only for .svelte)
```

---

## Data Flow

### Request Lifecycle

```
1. User requests /pond/shorebirds
       ↓
2. Vercel edge network
       ↓
3. SvelteKit SSR
       ↓
4. +layout.server.ts runs → loads config from Supabase
       ↓
5. +page.server.ts runs → loads post from Supabase
       ↓
6. +page.svelte renders with data
       ↓
7. HTML sent to user
       ↓
8. Client hydrates (becomes interactive)
```

### Database Query Flow

```
Component/Route
    ↓
calls getPosts() from posts-supabase.ts
    ↓
uses db.posts() helper from supabase.ts
    ↓
queries Supabase via @supabase/supabase-js
    ↓
returns data with types from database.ts
    ↓
converts JSONB arrays to strings (arrayToString)
    ↓
returns typed Post[] array
```

### CMS Update Flow

```
1. Editor changes post in Directus
       ↓
2. Directus writes to Supabase
       ↓
3. Next page request:
       ↓
4. SvelteKit queries Supabase
       ↓
5. Gets fresh data
       ↓
6. Renders updated page
```

**Note:** Config changes have 5-minute cache

### Configuration Loading

```
Route loads
    ↓
+layout.server.ts calls getCachedSiteConfig()
    ↓
Check if cache valid (< 5 min old)
    ├─ Yes → return cached config
    └─ No  → fetch from DB
        ↓
    db.siteConfig().select('*').single()
        ↓
    Convert to SiteConfig type
        ↓
    Cache for 5 minutes
        ↓
    Return config
```

---

## Database Schema

### Tables

#### `posts`

Blog post content and metadata

| Column           | Type        | Description                      |
| ---------------- | ----------- | -------------------------------- |
| `id`             | UUID        | Primary key                      |
| `slug`           | TEXT        | URL-friendly identifier          |
| `title`          | TEXT        | Post title                       |
| `subtitle`       | TEXT        | Optional subtitle                |
| `form`           | JSONB       | ["longform"] or ["shortform"]    |
| `category`       | JSONB       | ["documentary"], ["essay"], etc. |
| `date`           | DATE        | Publication date                 |
| `tags`           | JSONB       | ["tag1", "tag2", ...]            |
| `chapter`        | JSONB       | ["'25"], ["'24"], etc.           |
| `excerpt`        | TEXT        | Short description                |
| `content`        | TEXT        | Full markdown content            |
| `published`      | BOOLEAN     | Published status                 |
| `featured_image` | TEXT        | Image URL (optional)             |
| `created_at`     | TIMESTAMPTZ | Creation timestamp               |
| `updated_at`     | TIMESTAMPTZ | Last update timestamp            |

**Indexes:**

- Primary: `id`
- Unique: `slug`
- Index: `published, date DESC`

#### `site_config`

Site-wide configuration (singleton)

| Column            | Type        | Description                                   |
| ----------------- | ----------- | --------------------------------------------- |
| `id`              | UUID        | Fixed: `00000000-0000-0000-0000-000000000001` |
| `title`           | TEXT        | Site title                                    |
| `description`     | TEXT        | Site description                              |
| `current_chapter` | TEXT        | Active year filter                            |
| `base_url`        | TEXT        | Production URL                                |
| `watch_url`       | TEXT        | Featured video URL                            |
| `watch_title`     | TEXT        | Video title                                   |
| `watch_source`    | TEXT        | Creator name                                  |
| `media_url`       | TEXT        | Featured music URL                            |
| `media_title`     | TEXT        | Track title                                   |
| `media_source`    | TEXT        | Artist name                                   |
| `read_url`        | TEXT        | Featured reading URL                          |
| `read_title`      | TEXT        | Article title                                 |
| `read_source`     | TEXT        | Author name                                   |
| `artwork_src`     | TEXT        | Artwork image path                            |
| `artwork_title`   | TEXT        | Artwork name                                  |
| `artwork_artist`  | TEXT        | Artist name                                   |
| `created_at`      | TIMESTAMPTZ | Creation timestamp                            |
| `updated_at`      | TIMESTAMPTZ | Last update timestamp                         |

**Pattern:** Singleton (only 1 row allowed)

### JSONB Array Pattern

**Why JSONB?**

- Directus Tags interface requires arrays
- Flexible for future multi-select fields
- Proper data type for collections

**Storage:**

```sql
form: ["longform"]
category: ["documentary"]
tags: ["wildlife", "thailand", "conservation"]
```

**App Interface:**

```typescript
form: "longform"          // Single string
category: "documentary"   // Single string
tags: ["wildlife", ...]   // Array remains array
```

**Conversion:**

```typescript
// In posts-supabase.ts
function arrayToString(arr: string[]): string {
	return arr && arr.length > 0 ? arr[0] : '';
}

// Usage:
form: arrayToString(row.form); // ["longform"] → "longform"
```

### Row Level Security (RLS)

**Policies:**

```sql
-- Posts: Public read access
CREATE POLICY "Allow public read" ON posts
    FOR SELECT TO anon, authenticated
    USING (published = true);

-- Site Config: Public read access
CREATE POLICY "Allow public read" ON site_config
    FOR SELECT TO anon, authenticated
    USING (true);

-- Directus: Full access with service role
(Directus uses service_role key, bypasses RLS)
```

---

## Component Architecture

### Component Patterns

#### 1. Server-Loaded Pages

**Pattern:**

```
+page.server.ts  # Loads data
+page.svelte     # Renders with data
```

**Example:**

```typescript
// +page.server.ts
export const load = async () => {
    const posts = await getPosts();
    return { posts };
};

// +page.svelte
<script lang="ts">
    let { data } = $props();
    let posts = data.posts;
</script>
```

#### 2. Client-Side Reactive Components

**Uses Svelte 5 Runes:**

```svelte
<script lang="ts">
	// Props
	let { title }: { title: string } = $props();

	// State
	let count = $state(0);

	// Derived
	let doubled = $derived(count * 2);

	// Effects
	$effect(() => {
		console.log('Count:', count);
	});
</script>
```

#### 3. Reusable UI Components

**Location:** `src/components/`

**Examples:**

- `BackToTopButton.svelte` - Scroll behavior
- `PostPreview.svelte` - Display formatting
- `ThemeToggle.svelte` - State + UI

**Usage:**

```svelte
<script>
	import BackToTopButton from '$lib/components/BackToTopButton.svelte';
	let element: HTMLElement;
</script>

<div bind:this={element}>
	<!-- content -->
</div>

<BackToTopButton {element} variant="minimal" />
```

### Component Lifecycle

```
1. Component created
       ↓
2. Props initialized ($props)
       ↓
3. State initialized ($state)
       ↓
4. Derived values computed ($derived)
       ↓
5. onMount() runs (if present)
       ↓
6. Effects run ($effect)
       ↓
7. Component renders
       ↓
8. On updates: reactive values recompute
       ↓
9. onDestroy() runs (if present)
```

---

## Styling System

### Tailwind Configuration

**File:** `tailwind.config.ts`

```typescript
export default {
	darkMode: 'class', // .dark class on <html>
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				dark: '#151515',
				'off-white': '#DEDCDB',
				'pond-blue': '#5468FF',
				pond: '#2E2E2E'
			},
			animation: {
				marquee: 'marquee 20s linear infinite'
			}
		}
	}
};
```

### Typography Classes

**Location:** `src/app.css`

**Convention:** `{typeface}-typo-{variant}`

**Serif (Hedvig Letters Serif):**

- `.serif-typo` - Default
- `.serif-typo-body` - 18px body text
- `.serif-typo-paragraph` - 24px paragraphs
- `.serif-typo-h1` - 96px desktop headings
- `.serif-typo-h1-mobile` - 64px mobile headings

**Sans (Instrument Sans):**

- `.sans-typo` - Default
- `.sans-typo-title` - 42px, weight 300
- `.sans-typo-title-thin` - 42px, weight 200

**Mono (Inconsolata):**

- `.mono-typo-nav` - 16px navigation
- `.mono-typo-nav-large` - 20px large nav

### Global Styles

**Blog Content:**

- `.content` - Desktop blog post styling
- `.content-mobile` - Mobile blog post styling

Includes complete markdown rendering:

- Headings, paragraphs, lists
- Blockquotes, code blocks
- Tables, images, figures
- Links with underlines
- Footnotes

**Reusable UI:**

- `.button-secondary` - Standard button
- `.button-secondary-compact` - Compact button
- `.button-secondary-accent` - Accent color button
- `.post-preview` - Post title/subtitle hover effect

### Dark Mode

**Implementation:**

```html
<!-- app.html -->
<script>
	const theme = localStorage.getItem('theme') ?? 'dark';
	document.documentElement.classList.toggle('dark', theme === 'dark');
</script>
```

**Usage in CSS:**

```css
.bg-dark {
	background: #151515; /* Dark mode always */
}

/* Light mode variant */
.dark:bg-dark {
	background: #151515;
}
```

**Toggle:**

```svelte
<script>
	import { themeStore } from '$lib/stores/themeStore';

	function toggle() {
		themeStore.update((t) => (t === 'dark' ? 'light' : 'dark'));
	}
</script>
```

---

## State Management

### Svelte Stores

**Pattern:** Writable stores in `src/lib/stores/`

**Example:**

```typescript
// stores/themeStore.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const stored = browser ? (localStorage.getItem('theme') ?? 'dark') : 'dark';
export const themeStore = writable<'light' | 'dark'>(stored);

themeStore.subscribe((value) => {
	if (browser) {
		localStorage.setItem('theme', value);
		document.documentElement.classList.toggle('dark', value === 'dark');
	}
});
```

**Usage:**

```svelte
<script>
	import { themeStore } from '$lib/stores/themeStore';
</script>

<!-- Reactive: $ prefix -->
<p>Current theme: {$themeStore}</p>

<!-- Update -->
<button onclick={() => themeStore.set('light')}> Light Mode </button>
```

### Available Stores

| Store              | Purpose              | Persistence  |
| ------------------ | -------------------- | ------------ |
| `themeStore`       | Dark/light mode      | localStorage |
| `sideImageStore`   | Side panel image URL | localStorage |
| `attributionStore` | Attribution styling  | localStorage |

### Server State

**Pattern:** Loaded in `+layout.server.ts` or `+page.server.ts`

```typescript
export const load = async () => {
	const config = await getCachedSiteConfig();
	return { config };
};
```

**Accessed via:**

```svelte
<script>
	let { data } = $props();
	let config = data.config;
</script>
```

---

## Build & Deployment

### Development

```bash
npm run dev
```

- Starts Vite dev server on http://localhost:5173
- Hot module replacement (HMR)
- Fast refresh for Svelte components

### Build Process

```bash
npm run build
```

**Steps:**

1. TypeScript compilation
2. Svelte component compilation
3. Vite bundling
4. Route pre-rendering (if applicable)
5. Asset optimization
6. Output to `.svelte-kit/output/`

### Deployment (Vercel)

**Auto-deploy on:**

- Push to `main` branch
- Pull request created

**Build command:** `npm run build`

**Output directory:** `.svelte-kit/output`

**Environment variables:**

```bash
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

### Edge Functions

SvelteKit runs as Vercel Edge Functions:

- Global CDN distribution
- Sub-100ms latency
- Automatic scaling
- Server-side rendering per request

---

## Performance Optimizations

### Asset Preloading

**File:** `src/routes/+layout.svelte`

```typescript
const assets = ['/bg3.JPG', '/bg4.JPG'];
let loadedAssets = 0;

const loadImage = (src: string) => {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			loadedAssets++;
			resolve();
		};
		img.src = src;
	});
};

onMount(async () => {
	await Promise.all(assets.map(loadImage));
	isLoading = false;
});
```

### Caching Strategy

| Resource      | Cache Duration | Strategy      |
| ------------- | -------------- | ------------- |
| Site Config   | 5 minutes      | Server memory |
| Posts         | No cache       | Always fresh  |
| Static Assets | 1 year         | CDN + browser |
| API Routes    | No cache       | Fresh data    |

### Code Splitting

SvelteKit automatically splits:

- Each route into separate chunks
- Shared dependencies into common chunks
- Lazy-loaded components

### Image Optimization

- WebP/AVIF formats preferred
- Responsive images with `srcset`
- Lazy loading with Intersection Observer
- CDN distribution via Vercel

---

## Security

### Row Level Security (RLS)

All database queries go through RLS policies:

- Public can only read published posts
- Directus uses service_role (bypasses RLS)
- No direct database access from browser

### Environment Variables

**Public (client-side):**

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

**Private (server-side only):**

- (None currently, all queries use anon key)

### Content Security Policy

Not currently implemented (consider adding)

### HTTPS

- Enforced in production (Vercel)
- Automatic SSL certificates

---

## Testing & Quality

### Type Checking

```bash
npm run check
```

Validates:

- TypeScript types
- Svelte component props
- Database query types

### Code Formatting

```bash
npm run format  # Fix formatting
npm run lint    # Check formatting
```

**Rules:** (`.prettierrc`)

- Tabs for indentation
- Single quotes
- No trailing commas
- 100 character line width

### Build Validation

```bash
npm run build
```

Catches:

- Type errors
- Import errors
- Build configuration issues

### Unit Tests

**Framework:** Vitest + Testing Library

```bash
npm run test          # Run all tests
npm run test:unit     # Run unit tests only
npm run test:watch    # Watch mode
npm run test:ui       # Visual test UI
npm run test:coverage # Coverage report
```

**Test Files:**

- `src/lib/utils.test.ts` - Utility function tests
- `src/lib/server/helpers.test.ts` - Critical CMS helper tests

**Critical Tests:**

1. **arrayToString()** - JSONB array conversion (CMS integration)
2. **formatDate()** - Date formatting and Safari compatibility
3. **sortPostsByDate()** - Post ordering logic
4. **formatTagsForDisplay()** - Tag rendering

### Integration Tests

Tests database connectivity and queries.

```bash
npm run test:integration
```

**Requirements:**

- Valid `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`
- Database connection available

**Test Coverage:**

- Database connection
- Posts table schema validation
- Site config table validation
- JSONB array field handling
- RLS policy verification
- Query performance

**Test File:** `src/lib/server/database.integration.test.ts`

### Pre-Deployment Health Check

Comprehensive system validation before deployment.

```bash
npm run health-check
```

**Checks:**

1. ✓ Environment variables configured
2. ✓ Database connection working
3. ✓ Posts table structure valid
4. ✓ Site config table has data
5. ✓ JSONB fields correctly formatted
6. ✓ Dependencies installed
7. ✓ Type definitions present

**Exit Codes:**

- `0` - All checks passed
- `1` - One or more checks failed

**Script:** `scripts/health-check.ts`

### Continuous Integration

**GitHub Actions:** `.github/workflows/ci.yml`

**Jobs:**

1. **Type Check** - TypeScript validation
2. **Unit Tests** - Run on every PR/push
3. **Integration Tests** - Run if Supabase credentials available
4. **Build Test** - Ensure production build succeeds
5. **Health Check** - Pre-deployment validation

**Triggers:**

- Push to `main` or `develop`
- Pull requests to `main` or `develop`

### Testing Best Practices

**Before Committing:**

```bash
npm run check    # Type check
npm run test     # Run tests
npm run format   # Format code
```

**Before Deploying:**

```bash
npm run health-check  # System validation
npm run build        # Production build test
```

**In CI/CD:**

- All tests run automatically
- Deployment blocked if tests fail
- Integration tests require secrets

---

## Troubleshooting

### Common Issues

**Build fails with "supabaseUrl is required"**

- Cause: Environment variables not set during build
- Fix: Add `PUBLIC_SUPABASE_URL` in Vercel

**Config not loading from database**

- Cause: Layout reset bypassing server load
- Fix: Add `+layout.server.ts` at reset level

**Directus shows old schema**

- Cause: Cached metadata
- Fix: Delete from `directus_fields` and `directus_collections`

**Posts not appearing**

- Cause: `published = false` or future date
- Fix: Check post status and date

---

**Last Updated:** 2025-11-19
**Version:** 1.0.0
