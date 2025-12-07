# Pera Kasemsripitak

## Overview

**Live Site:** https://perakasem.com
**3rd Space (blog):** https://perakasem.com/pond
**CMS:** https://cms.perakasem.com

### Frontend

- **SvelteKit 2**
- **Svelte 5**
- **TypeScript**
- **Tailwind CSS 4**
- **Vite 6**

### Backend

- **Supabase**
- **Directus**

### Content

- **remark-gfm**
- **PostgreSQL**

---

## Architecture

```
┌─────────────────┐
│  Directus CMS   │
│     Railway     │
└────────┬────────┘
         │ writes to
         ↓
┌─────────────────┐
│    Supabase     │  (PostgreSQL database)
│  Supabase Cloud │
└────────┬────────┘
         │ reads from
         ↓
┌─────────────────┐
│  SvelteKit App  │  (Frontend + SSR)
│     Vercel      │
└────────┬────────┘
         │ serves to
         ↓
┌─────────────────┐
│     Users       │
└─────────────────┘
```

---

## Content Management

### Creating a Post

1. Login to Directus CMS
2. Navigate to **Content** → **Posts**
3. Click **"Create Item"**
4. Fill in post details:
   - Title, subtitle, content (markdown)
   - Form (longform/shortform)
   - Category, tags, chapter
   - Date, excerpt
5. Save as draft (`published: false`)
6. Publish when ready (Batch Edit → `published: true`)

### Updating Site Configuration

1. Go to **Content** → **Site Config**
2. Edit fields (title, description, featured content, etc.)
3. Save
4. Changes appear on site within 5 minutes

---

## Database Schema

### Tables

**posts** - Blog articles

- slug, title, subtitle, content
- form, category, tags, chapter (JSONB)
- published, date, excerpt
- created_at, updated_at

**site_config** - Site-wide configuration (singleton)

- title, description, current_chapter
- watch, media, read (featured content)
- artwork details

### Key Pattern

JSONB arrays for Directus compatibility:

```sql
-- Database stores:
form: ["longform"]
category: ["documentary"]

-- App receives:
form: "longform"
category: "documentary"
```

---

## Performance

- **Site Config:** 5-minute server cache
- **Posts:** Always fresh from database
- **Static Assets:** CDN cached via Vercel edge
- **SSR:** Every page request
- **Code Splitting:** Automatic per route

---

Typography:

- [Hedvig Letters Serif](https://fonts.google.com/specimen/Hedvig+Letters+Serif)
- [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans)
- [Inconsolata](https://fonts.google.com/specimen/Inconsolata)
