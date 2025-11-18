# CLAUDE.md - AI Assistant Guide

> **Last Updated:** 2025-11-18 (Refactoring Update)
> **Purpose:** Comprehensive guide for AI assistants working on this SvelteKit portfolio and blog codebase
> **Recent Changes:** Major refactoring reducing code duplication by ~400 lines

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Development Workflows](#development-workflows)
5. [Code Conventions](#code-conventions)
6. [Architecture Patterns](#architecture-patterns)
7. [Component Guidelines](#component-guidelines)
8. [Content Management](#content-management)
9. [Styling System](#styling-system)
10. [Common Tasks](#common-tasks)
11. [Troubleshooting](#troubleshooting)

---

## Project Overview

This is a personal portfolio and blog website ("3rd Space/Pond") built with SvelteKit 2 and Svelte 5. It features:

- **Portfolio Landing Page** - Two-section layout (2/3 content, 1/3 image panel)
- **Blog System ("Pond")** - Markdown-based with categories, tags, and archive
- **Dark Mode** - Class-based theme system with localStorage persistence
- **Responsive Design** - Mobile-first approach with breakpoint at 640px
- **Custom Typography** - Three typeface system (serif, sans-serif, monospace)
- **Asset Preloading** - Custom loading screen with progress tracking

**Production URL:** https://perakasem.co
**Blog URL:** https://perakasem.co/pond

---

## Technology Stack

### Core Framework
- **SvelteKit 2.16.0** - Full-stack web framework
- **Svelte 5.0.0** - Latest Svelte compiler with runes
- **Vite 6.0.0** - Build tool and dev server
- **TypeScript 5.0.0** - Type safety

### Styling
- **Tailwind CSS 4.0.6** - Utility-first CSS framework
- **@tailwindcss/vite** - JIT compilation via Vite plugin
- **PostCSS** - CSS processing pipeline
- **Autoprefixer** - Cross-browser CSS compatibility

### Content Processing
- **mdsvex 0.12.3** - Markdown to Svelte components
- **remark-gfm** - GitHub Flavored Markdown
- **remark-footnotes** - Footnote support
- **@microflash/remark-figure-caption** - Figure captions

### Development Tools
- **Prettier 3.4.2** - Code formatting (tabs, single quotes)
- **svelte-check** - Type checking for Svelte
- **publint** - Package quality validation

### Icons & Assets
- **svelte-stacks-icons** - Icon components
- **tech-stack-icons** - Technology icons
- **Google Fonts** - Hedvig Letters Serif, Instrument Sans, Inconsolata

---

## Directory Structure

```
/home/user/landing/
├── src/
│   ├── routes/                          # SvelteKit file-based routing
│   │   ├── (landing)/                   # Layout group for portfolio section
│   │   │   ├── +layout.svelte           # 2/3-1/3 split layout
│   │   │   ├── +page.svelte             # Home page
│   │   │   ├── bio/+page.svelte         # About/bio page
│   │   │   ├── resume/+page.svelte      # Resume page
│   │   │   ├── now/+page.svelte         # Now page
│   │   │   ├── construction/            # Placeholder pages
│   │   │   ├── privacy/                 # Privacy policy
│   │   │   └── terms/                   # Terms of use
│   │   ├── (pond)/                      # Layout group for blog section
│   │   │   ├── +layout.svelte           # Blog layout wrapper
│   │   │   └── pond/                    # Blog routes
│   │   │       ├── +page.svelte         # Blog home/listing
│   │   │       ├── +page.server.ts      # Server-side post loading
│   │   │       ├── +layout@.svelte      # Layout reset (@ syntax)
│   │   │       ├── [slug]/              # Dynamic post routes
│   │   │       │   ├── +page.svelte     # Individual post rendering
│   │   │       │   └── +page.server.ts  # Post data loading
│   │   │       └── archive/             # Post archive with filtering
│   │   │           ├── +page.svelte
│   │   │           └── +page.server.ts
│   │   ├── api/posts/+server.ts         # JSON API endpoint
│   │   ├── rss.xml/+server.ts           # RSS feed generation
│   │   ├── +layout.svelte               # Root layout (preloading)
│   │   └── +error.svelte                # Error page
│   ├── components/                      # Reusable Svelte components
│   │   ├── LoadingScreen.svelte         # Asset loading splash screen
│   │   ├── MenuContent.svelte           # Navigation menu
│   │   ├── ScrollProgress.svelte        # Reading progress bar
│   │   ├── ThemeToggle.svelte           # Dark/light mode switch
│   │   ├── ThemeManager.svelte          # Theme state management
│   │   ├── TechStacks.svelte            # Tech icon display
│   │   ├── AsteriskBig.svelte           # Decorative element
│   │   ├── AsteriskSmall.svelte         # Decorative element
│   │   ├── BackToTopButton.svelte       # Reusable back-to-top button
│   │   └── PostPreview.svelte           # Post title/subtitle display
│   ├── lib/
│   │   ├── stores/                      # Svelte stores (state)
│   │   │   ├── themeStore.ts            # Theme persistence
│   │   │   ├── sideImageStore.ts        # Side panel image state
│   │   │   ├── attributionStore.ts      # Attribution styling
│   │   │   ├── createPersistentStore.ts # Store factory pattern
│   │   │   └── config.ts                # Store configuration
│   │   ├── server/
│   │   │   └── posts.ts                 # Server-side post utilities
│   │   ├── pond.config.ts               # Blog configuration
│   │   ├── types.ts                     # TypeScript type definitions
│   │   ├── utils.ts                     # Utility functions
│   │   └── index.ts                     # Library exports
│   ├── posts/                           # Markdown blog posts
│   │   ├── shorebirds.md
│   │   ├── fishing-cats.md
│   │   ├── a-balancing-act.md
│   │   └── drafts.md
│   ├── app.html                         # HTML shell template
│   ├── app.d.ts                         # Global TypeScript definitions
│   ├── app.css                          # Global styles & typography
│   └── tailwind.css                     # Tailwind directives
├── static/                              # Static assets (images, etc.)
│   ├── favicon.ico
│   ├── default-image.JPG                # Background images
│   ├── bg3.JPG
│   ├── bg4.JPG
│   └── *.png, *.jpg                     # Artwork and icons
├── svelte.config.js                     # SvelteKit + mdsvex config
├── tailwind.config.ts                   # Tailwind theme configuration
├── vite.config.ts                       # Vite build configuration
├── mdsvex.config.js                     # Markdown processing config
├── postcss.config.js                    # PostCSS plugins
├── tsconfig.json                        # TypeScript configuration
├── .prettierrc                          # Code formatting rules
├── package.json                         # Dependencies & scripts
└── README.md                            # Basic documentation
```

---

## Development Workflows

### Starting Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Type checking
npm run check

# Watch mode type checking
npm run check:watch
```

### Code Quality

```bash
# Format all files
npm run format

# Check formatting (CI)
npm run lint

# Type checking
npm run check
```

### Building

```bash
# Production build
npm run build
# Runs: vite build && svelte-kit sync && svelte-package && publint

# Preview production build
npm run preview
```

### File Watching

The dev server automatically watches:
- `.svelte` files in `src/`
- `.ts` files in `src/`
- `.md` files in `src/posts/`
- Global styles in `src/app.css`
- Tailwind config changes

---

## Code Conventions

### Formatting (Prettier)

**Configuration:** `.prettierrc`

```json
{
  "useTabs": true,           // ✅ Use tabs for indentation
  "singleQuote": true,       // ✅ Single quotes for strings
  "trailingComma": "none",   // ❌ No trailing commas
  "printWidth": 100          // Max line length: 100 characters
}
```

**Plugins:**
- `prettier-plugin-svelte` - Svelte file formatting
- `prettier-plugin-tailwindcss` - Sort Tailwind classes

### TypeScript

**Configuration:** `tsconfig.json`

- Strict mode enabled
- ES2020 target
- Module resolution: bundler
- Paths: `$lib/*` → `src/lib/*`

**Type Definitions Location:** `src/lib/types.ts`

```typescript
export interface Post {
	title: string;
	subtitle?: string;
	form: 'longform' | 'shortform';
	category: string;
	date: string;
	tags: string[];
	chapter: string;
	excerpt: string;
	published: boolean;
	slug: string;
}

export interface GalleryImage {
	src: string;
	alt: string;
}

export interface PageData {
	images: GalleryImage[];
}
```

### File Naming

- **Components:** PascalCase (e.g., `LoadingScreen.svelte`, `ThemeToggle.svelte`)
- **Routes:** kebab-case folders with SvelteKit conventions (e.g., `+page.svelte`, `+layout.svelte`)
- **Utilities:** camelCase (e.g., `posts.ts`, `utils.ts`)
- **Types:** camelCase with `.ts` extension (e.g., `types.ts`)
- **Stores:** camelCase with `Store` suffix (e.g., `themeStore.ts`)

### Import Conventions

```typescript
// Use $lib alias for internal imports
import { getPosts } from '$lib/server/posts';
import type { Post } from '$lib/types';
import { themeStore } from '$lib/stores/themeStore';

// External dependencies
import { writable } from 'svelte/store';
import type { PageServerLoad } from './$types';
```

---

## Architecture Patterns

### SvelteKit Routing

This project uses **layout groups** to create distinct sections:

```
(landing)   → Portfolio section with 2/3-1/3 split layout
(pond)      → Blog section with different styling
```

**Layout Group Benefits:**
- Isolated styles per section
- Different component trees
- Section-specific layouts without URL nesting

**Key Files:**
- `+layout.svelte` - Nested layouts
- `+page.svelte` - Page components
- `+page.server.ts` - Server-side data loading
- `+layout@.svelte` - Layout reset (@ syntax breaks out of parent layouts)
- `[slug]` - Dynamic route parameters

### State Management

**Svelte Stores Pattern:**

```typescript
// src/lib/stores/themeStore.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const storedTheme = browser ? localStorage.getItem('theme') ?? 'dark' : 'dark';
export const themeStore = writable<'light' | 'dark'>(storedTheme);

themeStore.subscribe((value) => {
	if (browser) {
		localStorage.setItem('theme', value);
		document.documentElement.classList.toggle('dark', value === 'dark');
	}
});
```

**Usage in Components:**

```svelte
<script lang="ts">
	import { themeStore } from '$lib/stores/themeStore';

	function toggleTheme() {
		themeStore.update(t => t === 'dark' ? 'light' : 'dark');
	}
</script>
```

### Server-Side Data Loading

**Pattern:** `+page.server.ts` files

```typescript
import type { PageServerLoad } from './$types';
import { getPosts } from '$lib/server/posts';

export const load: PageServerLoad = async () => {
	const posts = await getPosts();
	return { posts };
};
```

**Benefits:**
- Runs only on server
- SEO-friendly (SSR)
- Data available before hydration

**Available Server Helpers:** `src/lib/server/posts.ts`

```typescript
// Get all published posts (sorted by date, newest first)
getPosts(): Promise<Post[]>

// Get all posts including drafts (for admin/preview)
getAllPosts(): Promise<Post[]>

// Get a single post by slug
getPostBySlug(slug: string): Promise<Post | null>

// Get navigation posts (previous and next)
getNavigationPosts(slug: string): Promise<{
	previousPost: Post | null;
	nextPost: Post | null;
}>
```

### Dynamic Routes

**Pattern:** `[slug]` folders (Refactored to use helper functions)

```typescript
// routes/pond/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import { getPostBySlug, getNavigationPosts } from '$lib/server/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	// Get the current post
	const post = await getPostBySlug(slug);
	if (!post) {
		throw error(404, `Post not found: ${slug}`);
	}

	// Get navigation posts (previous and next)
	const { previousPost, nextPost } = await getNavigationPosts(slug);

	return {
		meta: post,
		slug,
		previousPost,
		nextPost
	};
};
```

**Benefits of Refactored Approach:**
- Single source of truth for post loading logic
- Eliminates duplicate glob patterns across files
- Consistent slug extraction and date sorting
- Better type safety
- Easier to test and maintain

### Asset Preloading

**Root Layout Pattern:** `src/routes/+layout.svelte`

```typescript
const assetsToLoad = [
	'/default-image.JPG',
	'/bg3.JPG',
	'/bg4.JPG'
];

let loadedAssets = 0;
let loadingProgress = 0;
let isLoading = true;

const loadImage = (src: string): Promise<void> => {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			loadedAssets++;
			loadingProgress = (loadedAssets / assetsToLoad.length) * 100;
			resolve();
		};
		img.src = src;
	});
};

onMount(async () => {
	await Promise.all(assetsToLoad.map(loadImage));
	isLoading = false;
});
```

---

## Component Guidelines

### Component Structure

**Standard Pattern:**

```svelte
<script lang="ts">
	// 1. Imports
	import { fade, slide } from 'svelte/transition';
	import type { Post } from '$lib/types';

	// 2. Props
	let { posts }: { posts: Post[] } = $props();

	// 3. State
	let isOpen = $state(false);

	// 4. Derived values
	let filteredPosts = $derived(posts.filter(p => p.published));

	// 5. Functions
	function handleClick() {
		isOpen = !isOpen;
	}

	// 6. Effects
	$effect(() => {
		console.log('Posts changed:', posts.length);
	});
</script>

<!-- 7. Template -->
<div>
	{#each filteredPosts as post}
		<article>{post.title}</article>
	{/each}
</div>

<!-- 8. Styles (if needed) -->
<style>
	/* Component-scoped styles */
</style>
```

### Svelte 5 Runes

This project uses **Svelte 5** with runes:

- `$props()` - Component props
- `$state()` - Reactive state
- `$derived()` - Computed values
- `$effect()` - Side effects
- `$bindable()` - Two-way binding

**Example:**

```svelte
<script lang="ts">
	let count = $state(0);
	let doubled = $derived(count * 2);

	$effect(() => {
		console.log('Count changed:', count);
	});
</script>
```

### Transitions

**Common Transitions:**

```svelte
<script>
	import { fade, slide, fly } from 'svelte/transition';
</script>

<div in:fade={{ duration: 300 }}>Fade in</div>
<div out:slide={{ duration: 200 }}>Slide out</div>
<div in:fly={{ y: -20, duration: 300 }}>Fly in</div>
```

### Responsive Design

**Pattern:** Separate component trees for mobile/desktop

```svelte
<script lang="ts">
	import { onMount } from 'svelte';

	const mobileBreakpoint = 640;
	let isMobile = $state(false);

	onMount(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth < mobileBreakpoint;
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});
</script>

{#if isMobile}
	<MobileLayout />
{:else}
	<DesktopLayout />
{/if}
```

---

## Content Management

### Blog Post Structure

**Location:** `src/posts/*.md`

**Frontmatter Schema:**

```markdown
---
title: "Post Title"                    # Required
subtitle: "Optional subtitle"          # Optional
form: "longform"                       # "longform" | "shortform"
category: "documentary"                # Free text category
date: "2025-02-23"                     # YYYY-MM-DD format
tags: ["tag1", "tag2", "tag3"]        # Array of strings
chapter: "'25"                         # Usually year with apostrophe
excerpt: "Brief summary for listings"  # Plain text
published: true                        # true | false (draft control)
---

# Content starts here

Markdown content with **GFM support**.

## Supported Features

- GitHub Flavored Markdown
- Footnotes[^1]
- Tables
- Task lists
- Code blocks with syntax highlighting
- Figure captions

[^1]: This is a footnote
```

### Post Loading

**Server Utility:** `src/lib/server/posts.ts`

The post loading logic has been refactored to use centralized utility functions:

```typescript
import { extractSlugFromPath, sortPostsByDate } from '$lib/utils';

export async function getPosts(): Promise<Post[]> {
	const posts: Post[] = [];
	const paths = import.meta.glob('/src/posts/*.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		const slug = extractSlugFromPath(path); // Centralized slug extraction

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>;
			const post = { ...metadata, slug } satisfies Post;
			if (post.published) {
				posts.push(post);
			}
		}
	}

	return sortPostsByDate(posts, 'desc'); // Centralized date sorting
}
```

**Available Helper Functions:**

See [Architecture Patterns > Server-Side Data Loading](#server-side-data-loading) for all available server helpers:
- `getPosts()` - Get all published posts
- `getAllPosts()` - Get all posts including drafts
- `getPostBySlug(slug)` - Get specific post
- `getNavigationPosts(slug)` - Get prev/next posts

### Adding a New Post

1. Create file: `src/posts/my-new-post.md`
2. Add frontmatter with required fields
3. Write content in markdown
4. Set `published: true` when ready
5. Post automatically appears in listings

**URL:** `/pond/my-new-post`

### RSS Feed

**Endpoint:** `/rss.xml`

Automatically generates RSS feed from published posts. No manual updates needed.

---

## Styling System

### Tailwind Configuration

**File:** `tailwind.config.ts`

```typescript
export default {
	darkMode: 'class',  // Toggle via .dark class on <html>
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			animation: {
				marquee: 'marquee 20s linear infinite'
			}
		}
	}
}
```

### Typography System

**Location:** `src/app.css`

**Three Typeface System:**

1. **Serif - Hedvig Letters Serif** (body text, headings)
2. **Sans-serif - Instrument Sans** (titles, UI elements)
3. **Monospace - Inconsolata/JetBrains Mono** (code, navigation)

**Class Convention:** `{typeface}-typo-{variant}`

**Serif Classes:**

```css
.serif-typo                /* Default serif */
.serif-typo-body           /* Body text: 18px */
.serif-typo-paragraph      /* Paragraphs: 24px */
.serif-typo-h1             /* Desktop H1: 96px */
.serif-typo-h1-mobile      /* Mobile H1: 64px */
.serif-typo-title          /* Title: 52px */
.serif-typo-page-title     /* Page titles: 32px */
```

**Sans-serif Classes:**

```css
.sans-typo                 /* Default sans */
.sans-typo-title           /* Title: 42px, weight 300 */
.sans-typo-title-thin      /* Thin title: 42px, weight 200 */
.sans-typo-detail          /* Small text: 14px */
```

**Monospace Classes:**

```css
.mono-typo-nav             /* Navigation: 16px */
.mono-typo-nav-large       /* Large nav: 20px */
.archive-entry-mono        /* Archive entries: 20px */
```

### Reusable Component Styles

**Location:** `src/app.css`

**Button Styles:**

```css
.button-secondary          /* Standard button style */
.button-secondary-compact  /* Compact button with fit-content width */
.button-secondary-accent   /* Button with pond-blue accent color */
```

**Usage:**
```svelte
<a href="/pond" class="button-secondary-compact">Archive</a>
<div class="button-secondary-accent">Back to Top</div>
```

**Post Preview:**

```css
.post-preview              /* Post title/subtitle container with hover effect */
```

**Blog Content Styles:**

Global styles for blog post content, applied via class names:

```css
.content                   /* Desktop blog content styling */
.content-mobile            /* Mobile blog content styling */
```

These classes provide complete styling for markdown-rendered content including:
- Headings (h1-h4) with appropriate sizing and spacing
- Paragraphs with proper line-height and letter-spacing
- Lists (ul, ol) with custom styling
- Blockquotes with left border
- Links with wavy underline and hover effects
- Code blocks with syntax highlighting background
- Tables with borders and striped rows
- Images and figures with captions
- Horizontal rules
- Footnotes

**Usage:**
```svelte
<!-- Desktop -->
<div class="content">
	<svelte:component this={MarkdownContent} />
</div>

<!-- Mobile -->
<div class="content-mobile">
	<svelte:component this={MarkdownContent} />
</div>
```

**Benefits:**
- Single source of truth for blog styling
- Reduces component CSS from 250+ lines to ~50 lines
- Consistent styling across all blog posts
- Easy to maintain and update globally

### Color Palette

**Defined in:** `src/app.css`

```css
/* Dark Mode (default) */
--bg-dark: #151515;         /* Main background */
--text-off-white: #DEDCDB;  /* Body text */
--text-pond-blue: #5468FF;  /* Accent color */
--bg-gray: #2E2E2E;         /* Secondary background */

/* Tailwind Classes */
.bg-dark         → #151515
.text-off-white  → #DEDCDB
.text-pond-blue  → #5468FF
.bg-gray         → #2E2E2E
```

### Dark Mode Implementation

**HTML Initialization:** `src/app.html`

```html
<script>
	const theme = localStorage.getItem('theme') ?? 'dark';
	document.documentElement.classList.toggle('dark', theme === 'dark');
</script>
```

**Toggle Component:** `src/components/ThemeToggle.svelte`

```typescript
import { themeStore } from '$lib/stores/themeStore';

function toggleTheme() {
	themeStore.update(t => t === 'dark' ? 'light' : 'dark');
}
```

### Special Effects

**Noise Texture Overlay:**

```css
/* Applied to dark backgrounds */
background-image: url("data:image/svg+xml,...");
```

**Custom Animations:**

```css
/* Marquee scrolling */
@keyframes marquee {
	0% { transform: translateX(0); }
	100% { transform: translateX(-50%); }
}
```

---

## Common Tasks

### Adding a New Page

**1. Create route file:**

```bash
# For landing section
src/routes/(landing)/my-page/+page.svelte

# For blog section
src/routes/(pond)/pond/my-page/+page.svelte
```

**2. Add content:**

```svelte
<script lang="ts">
	// Page logic
</script>

<div class="container">
	<h1 class="serif-typo-h1">Page Title</h1>
	<p class="serif-typo-body">Content here</p>
</div>
```

**3. Add to navigation (if needed):**

Edit `src/components/MenuContent.svelte`

### Adding a Component

**1. Create file:** `src/components/MyComponent.svelte`

```svelte
<script lang="ts">
	import type { ComponentProps } from 'svelte';

	let { title, items }: {
		title: string;
		items: string[];
	} = $props();
</script>

<div class="my-component">
	<h2>{title}</h2>
	<ul>
		{#each items as item}
			<li>{item}</li>
		{/each}
	</ul>
</div>

<style>
	.my-component {
		/* Scoped styles */
	}
</style>
```

**2. Use in page:**

```svelte
<script lang="ts">
	import MyComponent from '$lib/components/MyComponent.svelte';
</script>

<MyComponent title="Hello" items={['a', 'b', 'c']} />
```

### Using Reusable Components

**BackToTopButton Component:**

```svelte
<script lang="ts">
	import BackToTopButton from '$lib/components/BackToTopButton.svelte';

	let element: HTMLElement;
</script>

<div bind:this={element}>
	<!-- Your content here -->
</div>

<!-- Minimal variant (text only) -->
<BackToTopButton {element} variant="minimal" />

<!-- Boxed variant (with border) -->
<BackToTopButton {element} variant="boxed" />
```

**PostPreview Component:**

```svelte
<script lang="ts">
	import PostPreview from '$lib/components/PostPreview.svelte';
	import type { Post } from '$lib/types';

	let { post, isMobile }: { post: Post; isMobile: boolean } = $props();
</script>

<a href={`/pond/${post.slug}`}>
	<PostPreview title={post.title} subtitle={post.subtitle} {isMobile} />
</a>
```

### Using Utility Functions

**Date Utilities:** `src/lib/utils.ts`

```typescript
import { formatDate, convertDateSeparators, compareDates, sortPostsByDate } from '$lib/utils';
import type { Post } from '$lib/types';

// Format date for display
const formattedDate = formatDate('2025-02-23', 'long'); // "February 23, 2025"

// Convert to DD/MM/YYYY format
const dateString = convertDateSeparators('2025-02-23'); // "23/02/2025"

// Sort posts by date
const sortedPosts = sortPostsByDate(posts, 'desc'); // Newest first
const oldestFirst = sortPostsByDate(posts, 'asc'); // Oldest first

// Compare two posts (for custom sorting)
const comparison = compareDates(postA, postB, 'desc');
```

**Slug and Tag Utilities:**

```typescript
import { extractSlugFromPath, formatTagsForDisplay } from '$lib/utils';

// Extract slug from file path
const slug = extractSlugFromPath('/src/posts/my-post.md'); // "my-post"

// Format tags for display
const tagsString = formatTagsForDisplay(['tech', 'svelte', 'web']); // "tech, svelte, web"
```

**Benefits:**
- Consistent date formatting across the app
- Single source of truth for sorting logic
- Type-safe utility functions with JSDoc documentation
- Eliminates code duplication

### Adding a Store

**Method 1: Using Persistent Store Factory (Recommended)**

For stores that need localStorage persistence, use the factory pattern:

```typescript
// src/lib/stores/myStore.ts
import { createPersistentStore } from './createPersistentStore';

export const myStore = createPersistentStore<string>(
	'myKey',           // localStorage key
	'default',         // default value
	(v) => v,          // serialize function (optional)
	(v) => v           // deserialize function (optional)
);
```

**Method 2: Manual Store Creation**

For simple stores without persistence:

```typescript
// src/lib/stores/myStore.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const initialValue = browser
	? localStorage.getItem('myKey') ?? 'default'
	: 'default';

export const myStore = writable<string>(initialValue);

myStore.subscribe((value) => {
	if (browser) {
		localStorage.setItem('myKey', value);
	}
});
```

**Using the Store:**

```svelte
<script lang="ts">
	import { myStore } from '$lib/stores/myStore';

	function updateValue() {
		myStore.set('new value');
	}
</script>

<p>Current value: {$myStore}</p>
```

**Benefits of Factory Pattern:**
- Less boilerplate code
- Consistent localStorage handling
- Automatic SSR safety
- Reusable across multiple stores

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Update all packages (careful!)
npm update

# After updates, test:
npm run check
npm run build
```

### Adding mdsvex Plugins

**1. Install plugin:**

```bash
npm install remark-plugin-name
```

**2. Update config:** `mdsvex.config.js`

```javascript
import { remarkPluginName } from 'remark-plugin-name';

export default {
	extensions: ['.md', '.svx'],
	remarkPlugins: [
		remarkGfm,
		remarkFootnotes,
		remarkFigureCaption,
		remarkPluginName  // Add here
	]
}
```

---

## Troubleshooting

### Build Errors

**Issue:** TypeScript errors during build

```bash
# Clear SvelteKit cache
rm -rf .svelte-kit

# Regenerate types
npm run prepare

# Run type check
npm run check
```

**Issue:** Vite cache issues

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

### Markdown Not Rendering

**Check:**

1. File extension is `.md` or `.svx`
2. Frontmatter is valid YAML
3. `published: true` is set
4. File is in `src/posts/` directory

**Debug:**

```typescript
// Add logging to src/lib/server/posts.ts
console.log('Loaded modules:', Object.keys(modules));
```

### Styles Not Applying

**Check:**

1. Tailwind classes are in `content` paths (tailwind.config.ts)
2. Global styles imported in `src/app.css`
3. Component styles are in `<style>` block
4. Dark mode class on `<html>` element

**Debug:**

```bash
# Check if Tailwind is processing
npm run dev
# Look for Tailwind logs in console
```

### Image Not Loading

**Check:**

1. Image is in `static/` directory
2. Path starts with `/` (e.g., `/image.jpg`)
3. File extension case matches exactly
4. Image is preloaded if needed (see root layout)

**Debug:**

```svelte
<img
	src="/image.jpg"
	alt="Test"
	onerror="console.error('Failed to load:', this.src)"
/>
```

### Store Not Persisting

**Check:**

1. `browser` check before `localStorage` access
2. Subscribe function is called
3. LocalStorage quota not exceeded
4. Private browsing not blocking storage

**Debug:**

```typescript
import { browser } from '$app/environment';

if (browser) {
	console.log('LocalStorage available:', !!window.localStorage);
	console.log('Stored value:', localStorage.getItem('key'));
}
```

### Dark Mode Not Working

**Check:**

1. `dark` class on `<html>` element
2. `darkMode: 'class'` in tailwind.config.ts
3. Theme initialization in app.html runs before render
4. Store subscription updates DOM

**Debug:**

```javascript
// In browser console
console.log(document.documentElement.classList.contains('dark'));
console.log(localStorage.getItem('theme'));
```

---

## Important Files Reference

### Configuration Files

| File | Purpose | Key Settings |
|------|---------|--------------|
| `svelte.config.js` | SvelteKit config | mdsvex integration, adapter-auto |
| `vite.config.ts` | Build config | Tailwind plugin, GSAP optimization |
| `tailwind.config.ts` | Styling config | Dark mode, custom animations |
| `mdsvex.config.js` | Markdown config | Remark plugins, extensions |
| `tsconfig.json` | TypeScript config | Strict mode, path aliases |
| `.prettierrc` | Formatting | Tabs, single quotes, 100 char width |
| `package.json` | Dependencies | Scripts, peer deps, dev deps |

### Core Application Files

| File | Purpose | Key Exports |
|------|---------|-------------|
| `src/lib/types.ts` | Type definitions | `Post`, `GalleryImage`, `PageData` |
| `src/lib/server/posts.ts` | Post loading | `getPosts()`, `getAllPosts()`, `getPostBySlug()`, `getNavigationPosts()` |
| `src/lib/utils.ts` | Utilities | `formatDate()`, `sortPostsByDate()`, `extractSlugFromPath()`, `compareDates()`, `formatTagsForDisplay()` |
| `src/lib/stores/createPersistentStore.ts` | Store factory | `createPersistentStore()` |
| `src/lib/pond.config.ts` | Blog config | Site metadata, URLs |
| `src/app.html` | HTML shell | Dark mode init, fonts |
| `src/app.css` | Global styles | Typography, colors, base, `.content`, `.content-mobile`, `.button-secondary*`, `.post-preview` |

### Reusable Components

| File | Purpose | Props |
|------|---------|-------|
| `src/components/BackToTopButton.svelte` | Back to top button | `element: HTMLElement`, `variant?: 'minimal' \| 'boxed'` |
| `src/components/PostPreview.svelte` | Post title/subtitle display | `title: string`, `subtitle: string`, `isMobile?: boolean` |
| `src/components/LoadingScreen.svelte` | Asset loading splash | `progress: number` |
| `src/components/ScrollProgress.svelte` | Reading progress bar | Auto-tracking |
| `src/components/ThemeToggle.svelte` | Dark/light mode switch | None |

### Layout Files

| File | Purpose |
|------|---------|
| `src/routes/+layout.svelte` | Root layout with preloading |
| `src/routes/(landing)/+layout.svelte` | 2/3-1/3 split layout |
| `src/routes/(pond)/+layout.svelte` | Blog wrapper layout |
| `src/routes/(pond)/pond/+layout@.svelte` | Layout reset for blog |

---

## Git Workflow

### Branch Strategy

**Development Branch:** `claude/claude-md-{session-id}`

**Important:**
- Always develop on designated Claude branch
- Never push to `main` without permission
- Branch names must start with `claude/` and end with session ID

### Commit Guidelines

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add new blog post filtering feature"

# Push to designated branch
git push -u origin claude/branch-name
```

**Commit Message Format:**

```
type: brief description

- Detailed point 1
- Detailed point 2
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Creating Pull Requests

```bash
# Ensure branch is up to date
git status

# Push if needed
git push -u origin claude/branch-name

# Create PR (provide URL to user)
# Include summary and test plan
```

---

## Additional Notes

### Performance Considerations

- **Image optimization:** Use appropriate formats (WebP, AVIF) when possible
- **Code splitting:** SvelteKit automatically splits routes
- **Asset preloading:** Critical images preloaded in root layout
- **Lazy loading:** Non-critical components loaded on demand

### SEO Considerations

- **Server-side rendering:** All pages are SSR by default
- **Meta tags:** Add to individual routes with `<svelte:head>`
- **RSS feed:** Available at `/rss.xml`
- **Sitemap:** Not currently implemented (consider adding)

### Accessibility

- **Semantic HTML:** Use proper heading hierarchy
- **ARIA labels:** Add to interactive elements
- **Keyboard navigation:** Ensure all interactions work with keyboard
- **Color contrast:** Verify against WCAG guidelines

### Security

- **No user input:** Static site with no forms/comments
- **Content Security Policy:** Not currently implemented
- **HTTPS:** Enforced in production
- **Dependencies:** Regularly update and audit

---

## Questions & Support

### Documentation Resources

- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [Svelte 5 Docs](https://svelte.dev/docs/svelte/overview)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [mdsvex Docs](https://mdsvex.pngwn.io/)

### Codebase-Specific Questions

When uncertain:

1. Search existing code for similar patterns
2. Check `src/lib/types.ts` for type definitions
3. Review configuration files for settings
4. Test changes in development before committing

---

**Last Updated:** 2025-11-18
**Maintained By:** AI Assistants working on this repository
**Status:** Active Development
