# Content Page CMS Strategy

This document outlines strategies for managing content-heavy pages (Bio, Resume, Now, etc.) through the CMS while preserving complex layouts and interactive elements.

## Overview

Content pages like **Bio** present unique challenges:
- ✅ Interactive elements (buttons, links)
- ✅ Different mobile/desktop layouts
- ✅ Complex HTML structure
- ✅ Custom components (TechStacks, etc.)
- ✅ Responsive behavior

We need a solution that allows content editing without requiring code pushes, while maintaining developer control over layout and behavior.

---

## Recommended Approach: Structured Content Blocks

Store page content as **JSON arrays** in the `content_pages` table, with separate arrays for desktop and mobile layouts.

### Database Schema

Already created in `supabase-schema.sql`:

```sql
CREATE TABLE content_pages (
    id UUID PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content JSONB NOT NULL,  -- Structured content blocks
    meta_description TEXT,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Content Structure

```typescript
{
  "desktop": ContentBlock[],
  "mobile": ContentBlock[]  // Optional - falls back to desktop
}
```

### Content Block Types

See `src/lib/types/database.ts` for full type definitions:

```typescript
type ContentBlock =
  | TextBlock
  | HeadingBlock
  | ImageBlock
  | ButtonBlock
  | GridBlock
  | ComponentBlock
  | HTMLBlock
```

---

## Example: Bio Page

### Current Bio Structure

The Bio page currently has:
- Intro text
- Sections with titles and descriptions
- Buttons linking to different pages
- Different layouts for mobile/desktop

### CMS-Managed Version

#### Database Entry

```json
{
  "slug": "bio",
  "title": "Bio",
  "content": {
    "desktop": [
      {
        "type": "text",
        "content": "I'm a photographer, designer, and filmmaker based in Bangkok.",
        "className": "serif-typo-body mb-4"
      },
      {
        "type": "grid",
        "columns": 2,
        "className": "my-8",
        "items": [
          {
            "type": "heading",
            "level": 2,
            "content": "Photography"
          },
          {
            "type": "text",
            "content": "Description of photography work..."
          },
          {
            "type": "button",
            "label": "View Photography",
            "href": "/photography",
            "variant": "secondary"
          }
        ]
      }
    ],
    "mobile": [
      {
        "type": "text",
        "content": "I'm a photographer, designer, and filmmaker based in Bangkok.",
        "className": "serif-typo-body-small mb-4"
      }
      // Simplified mobile layout
    ]
  }
}
```

#### Svelte Page Implementation

```svelte
<!-- src/routes/(landing)/bio/+page.svelte -->
<script lang="ts">
	import ContentRenderer from '$lib/components/ContentRenderer.svelte';
	import { onMount } from 'svelte';

	export let data;

	let isMobile = $state(false);
	const mobileBreakpoint = 640;

	onMount(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth < mobileBreakpoint;
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});

	// Use mobile content if available, otherwise fallback to desktop
	const blocks = $derived(
		isMobile && data.content.mobile
			? data.content.mobile
			: data.content.desktop
	);
</script>

<svelte:head>
	<title>{data.title}</title>
	{#if data.meta_description}
		<meta name="description" content={data.meta_description} />
	{/if}
</svelte:head>

<article class="bio-page">
	<ContentRenderer {blocks} {isMobile} />
</article>
```

#### Server Load Function

```typescript
// src/routes/(landing)/bio/+page.server.ts
import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const { data, error: err } = await supabase
		.from('content_pages')
		.select('*')
		.eq('slug', 'bio')
		.eq('published', true)
		.single();

	if (err || !data) {
		throw error(404, 'Page not found');
	}

	return {
		title: data.title,
		content: data.content,
		meta_description: data.meta_description
	};
};
```

---

## Directus Configuration for Content Pages

### Custom Interface for Content Blocks

You'll need to create a custom Directus interface for editing content blocks visually.

#### Option 1: Use Built-in JSON Editor

1. In Directus, go to **Settings** > **Data Model** > **content_pages**
2. Configure `content` field:
   - **Interface**: JSON
   - **Display**: Code (JSON)

**Pros:**
- Quick to set up
- Full control

**Cons:**
- Requires JSON knowledge
- Not user-friendly

#### Option 2: Custom Block Editor Extension

Create a Directus extension for visual block editing:

```bash
# In your Directus installation
npx create-directus-extension

# Choose:
# - Type: Interface
# - Name: content-blocks
# - Language: TypeScript
```

The extension would provide:
- Drag-and-drop blocks
- Visual preview
- Form fields for each block type
- Mobile/desktop layout switcher

**Example UI:**
```
┌────────────────────────────────────┐
│ Layout: [Desktop ▼] [Mobile]      │
├────────────────────────────────────┤
│ ┌─────────────────────────────┐   │
│ │ + Add Block                 │   │
│ └─────────────────────────────┘   │
│                                    │
│ ┌─────────────────────────────┐   │
│ │ 📝 Text Block              │▲▼ │
│ │ Content: "I'm a photogra..."│❌ │
│ │ Class: serif-typo-body      │   │
│ └─────────────────────────────┘   │
│                                    │
│ ┌─────────────────────────────┐   │
│ │ 🔘 Button Block            │▲▼ │
│ │ Label: View Photography     │❌ │
│ │ URL: /photography           │   │
│ │ Variant: secondary          │   │
│ └─────────────────────────────┘   │
└────────────────────────────────────┘
```

---

## Alternative Approaches

### Approach 2: Markdown with Shortcodes

Use markdown for content with custom shortcodes for components:

```markdown
# Bio

I'm a photographer, designer, and filmmaker based in Bangkok.

[button label="View Photography" href="/photography" variant="secondary"]

[grid columns="2"]
[column]
## Photography
Description...
[/column]
[column]
## Design
Description...
[/column]
[/grid]
```

**Implementation:**

```typescript
// src/lib/shortcodes.ts
import { parse } from 'shortcode-parser';

export function parseShortcodes(content: string): string {
	const blocks = parse(content, {
		button: (attrs) => {
			return `<a href="${attrs.href}" class="button-secondary-compact">${attrs.label}</a>`;
		},
		grid: (attrs, content) => {
			return `<div class="grid" style="grid-template-columns: repeat(${attrs.columns}, 1fr);">${content}</div>`;
		}
		// ... more shortcodes
	});

	return blocks;
}
```

**Pros:**
- Markdown is familiar
- Easy to write
- Can include HTML

**Cons:**
- Parsing complexity
- Limited to simple layouts
- Hard to preview in CMS

### Approach 3: Hybrid Content + Code Layout

Keep layout in code, make only text/images editable:

```typescript
// Database
{
  slug: "bio",
  content: {
    intro: "I'm a photographer...",
    sections: [
      {
        id: "photography",
        title: "Photography",
        description: "Description...",
        buttonLabel: "View Photography",
        buttonHref: "/photography",
        image: "/photography-thumb.jpg"
      },
      {
        id: "design",
        title: "Design",
        // ...
      }
    ]
  }
}
```

```svelte
<!-- src/routes/(landing)/bio/+page.svelte -->
<script>
  export let data;
  const { content } = data;
</script>

<!-- Layout controlled by code -->
{#if isMobile}
  <div class="mobile-layout">
    <p class="serif-typo-body-small">{content.intro}</p>

    {#each content.sections as section}
      <section>
        <h2 class="serif-typo-title-mobile">{section.title}</h2>
        <p class="serif-typo-body-small">{section.description}</p>
        <a href={section.buttonHref} class="button-secondary-compact">
          {section.buttonLabel}
        </a>
      </section>
    {/each}
  </div>
{:else}
  <div class="desktop-layout grid grid-cols-2 gap-8">
    <div class="intro">
      <p class="serif-typo-body">{content.intro}</p>
    </div>

    {#each content.sections as section}
      <div class="section">
        <img src={section.image} alt={section.title} />
        <h2 class="serif-typo-title">{section.title}</h2>
        <p class="serif-typo-body">{section.description}</p>
        <a href={section.buttonHref} class="button-secondary">
          {section.buttonLabel}
        </a>
      </div>
    {/each}
  </div>
{/if}
```

**Pros:**
- Layout stays in developer control
- Content is easily editable
- Responsive behavior in code
- Simple CMS editing

**Cons:**
- Layout changes require code deployment
- Less flexible than full block system

---

## Recommendation Summary

### For Bio, Resume, Now Pages: Use Hybrid Approach (Approach 3)

**Why:**
- ✅ Balances flexibility and simplicity
- ✅ Developers control layout/responsive behavior
- ✅ Content editors can update text/images easily
- ✅ No complex custom Directus interfaces needed
- ✅ Easier to maintain

**Implementation Steps:**

1. **Define content schema** per page
2. **Create Directus collections** with JSON fields
3. **Update Svelte pages** to fetch from database
4. **Keep layouts in code**, bind content variables

### For Future Complex Pages: Use Block System (Approach 1)

If you need full CMS control over layout:
- ✅ Build custom Directus block editor extension
- ✅ Use `ContentRenderer` component
- ✅ Define comprehensive block types

---

## Example Implementation

### Bio Page with Hybrid Approach

#### 1. Database Entry (via Directus)

```json
{
  "slug": "bio",
  "title": "Bio",
  "content": {
    "intro": "I'm a photographer, designer, and filmmaker based in Bangkok, Thailand.",
    "sections": [
      {
        "title": "Photography",
        "description": "Capturing moments and telling stories through the lens.",
        "buttonLabel": "View Photography",
        "buttonHref": "/photography",
        "icon": "camera"
      },
      {
        "title": "Design",
        "description": "Creating beautiful and functional experiences.",
        "buttonLabel": "View Design Work",
        "buttonHref": "/design",
        "icon": "palette"
      },
      {
        "title": "Film",
        "description": "Bringing stories to life through motion.",
        "buttonLabel": "Watch Films",
        "buttonHref": "/film",
        "icon": "film"
      }
    ],
    "footer": "Let's create something together."
  }
}
```

#### 2. Server Load Function

```typescript
// src/routes/(landing)/bio/+page.server.ts
import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const { data, error: err } = await supabase
		.from('content_pages')
		.select('*')
		.eq('slug', 'bio')
		.eq('published', true)
		.single();

	if (err || !data) {
		throw error(404, 'Page not found');
	}

	return data.content;
};
```

#### 3. Svelte Page

```svelte
<script lang="ts">
	import { onMount } from 'svelte';

	export let data;

	let isMobile = $state(false);

	onMount(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth < 640;
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});
</script>

<svelte:head>
	<title>Bio</title>
</svelte:head>

{#if isMobile}
	<!-- Mobile Layout -->
	<div class="px-8 py-16">
		<p class="serif-typo-body-small mb-8">{data.intro}</p>

		{#each data.sections as section}
			<section class="mb-12">
				<h2 class="serif-typo-title-mobile mb-2">{section.title}</h2>
				<p class="serif-typo-body-small mb-4">{section.description}</p>
				<a href={section.buttonHref} class="button-secondary-compact">
					{section.buttonLabel}
				</a>
			</section>
		{/each}

		<p class="serif-typo-body-small mt-16">{data.footer}</p>
	</div>
{:else}
	<!-- Desktop Layout -->
	<div class="max-w-6xl mx-auto px-16 py-24">
		<p class="serif-typo-body mb-16 max-w-2xl">{data.intro}</p>

		<div class="grid grid-cols-3 gap-12">
			{#each data.sections as section}
				<div class="section">
					<h2 class="serif-typo-title mb-4">{section.title}</h2>
					<p class="serif-typo-body mb-6">{section.description}</p>
					<a href={section.buttonHref} class="button-secondary">
						{section.buttonLabel}
					</a>
				</div>
			{/each}
		</div>

		<p class="serif-typo-body mt-24">{data.footer}</p>
	</div>
{/if}
```

---

## Migration Checklist

- [ ] Set up `content_pages` table in Supabase
- [ ] Create content entry in Directus for each page
- [ ] Update page server load functions
- [ ] Update Svelte page components
- [ ] Test on mobile and desktop
- [ ] Deploy changes
- [ ] Train content editors on CMS

---

**Result:** Content editors can now update Bio, Resume, and other pages directly in Directus without touching code!
