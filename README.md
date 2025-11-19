# 3rd Space / Pond

**Personal portfolio and blog with headless CMS integration**

[![Built with SvelteKit](https://img.shields.io/badge/SvelteKit-2.16-orange?logo=svelte)](https://kit.svelte.dev)
[![Powered by Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com)
[![CMS: Directus](https://img.shields.io/badge/CMS-Directus-blue?logo=directus)](https://directus.io)

---

## Overview

Modern, CMS-driven portfolio and blog built with SvelteKit 2 and Svelte 5. Content is managed through Directus CMS and stored in Supabase PostgreSQL, enabling non-technical content updates without code deployments.

**Live Site:** https://perakasem.co

---

## Features

✅ **CMS-Managed Content** - Create and edit posts via Directus admin UI
✅ **Database-Driven** - PostgreSQL with full type safety
✅ **Instant Updates** - Changes appear within 5 minutes
✅ **Server-Side Rendering** - SEO-friendly with Vercel edge deployment
✅ **Dark Mode** - Persistent theme with localStorage
✅ **Responsive Design** - Mobile-first approach
✅ **Custom Typography** - Three typeface system (serif, sans, mono)
✅ **Markdown Support** - Rich text with GitHub Flavored Markdown
✅ **Draft Workflow** - Publish/unpublish with single toggle

---

## Tech Stack

### Frontend

- **SvelteKit 2** - Full-stack web framework
- **Svelte 5** - Reactive UI with runes
- **TypeScript** - End-to-end type safety
- **Tailwind CSS 4** - Utility-first styling
- **Vite 6** - Lightning-fast dev server

### Backend

- **Supabase** - PostgreSQL database + auth
- **Directus** - Headless CMS admin
- **Vercel** - Edge hosting + serverless functions

### Content

- **mdsvex** - Markdown processing
- **remark-gfm** - GitHub Flavored Markdown
- **PostgreSQL** - Structured data storage

---

## Architecture

```
┌─────────────────┐
│  Directus CMS   │  (Content editing UI)
│  Render/Railway │
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

## Quick Start

### Prerequisites

- Node.js 18+
- Supabase account
- Directus deployed (Render/Railway)
- Vercel account

### Installation

```bash
# Clone repository
git clone https://github.com/perakasem/landing.git
cd landing

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase credentials to .env

# Start development server
npm run dev
```

### Environment Variables

```bash
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Development

```bash
npm run dev          # Start dev server (localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run check        # Type checking
npm run format       # Format code with Prettier
```

---

## Testing

Comprehensive test suite to ensure code quality and prevent regressions.

### Unit Tests

```bash
npm run test              # Run all tests
npm run test:unit         # Unit tests only
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

**Test Coverage:**

- ✓ Critical helper functions (arrayToString, formatDate)
- ✓ Post sorting and filtering logic
- ✓ Tag formatting
- ✓ Date conversion utilities

### Integration Tests

```bash
npm run test:integration  # Database connectivity tests
```

Validates:

- Database connection
- Table schemas
- JSONB field handling
- RLS policies
- Query performance

### Health Check

Pre-deployment validation:

```bash
npm run health-check
```

Verifies:

- ✓ Environment variables
- ✓ Database connectivity
- ✓ Table structures
- ✓ Dependencies
- ✓ Type definitions

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

## Documentation

| Document                                 | Purpose             | Audience        |
| ---------------------------------------- | ------------------- | --------------- |
| **README.md**                            | Project overview    | Everyone        |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Technical deep-dive | Developers      |
| **[CMS-GUIDE.md](./CMS-GUIDE.md)**       | CMS setup & usage   | Content editors |
| **[CLAUDE.md](./CLAUDE.md)**             | AI assistant guide  | AI assistants   |

---

## Project Structure

```
landing/
├── src/
│   ├── routes/              # SvelteKit file-based routing
│   │   ├── (landing)/       # Portfolio pages
│   │   └── (pond)/          # Blog pages
│   ├── lib/
│   │   ├── server/          # Server-only code
│   │   │   ├── posts-supabase.ts    # Post queries
│   │   │   └── config.ts             # Config loader
│   │   ├── supabase.ts      # Shared DB client
│   │   └── types/           # TypeScript definitions
│   ├── components/          # Reusable UI components
│   └── app.css              # Global styles
├── static/                  # Static assets
├── database/schema.sql      # Complete DB schema
├── ARCHITECTURE.md          # Technical documentation
├── CMS-GUIDE.md            # CMS documentation
└── package.json
```

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

## Deployment

### Vercel (Frontend)

**Automatic deployment** on push to `main` branch.

**Environment variables required:**

```bash
PUBLIC_SUPABASE_URL=...
PUBLIC_SUPABASE_ANON_KEY=...
```

### Directus (CMS)

Deploy on Render or Railway with:

- Database: Connect to Supabase
- Environment: See CMS-GUIDE.md

### Supabase (Database)

1. Create project
2. Run `database/schema.sql` in SQL Editor
3. Configure RLS policies

---

## Performance

- **Site Config:** 5-minute server cache
- **Posts:** Always fresh from database
- **Static Assets:** CDN cached via Vercel edge
- **SSR:** Every page request
- **Code Splitting:** Automatic per route

---

## Contributing

This is a personal portfolio project. If you find issues or have suggestions, feel free to open an issue.

---

## License

MIT License - See LICENSE file for details

---

## Contact

**Pera Kasemsripitak**

- Website: https://perakasem.co
- Blog: https://perakasem.co/pond

---

## Acknowledgments

Built with:

- [SvelteKit](https://kit.svelte.dev) - Framework
- [Supabase](https://supabase.com) - Database
- [Directus](https://directus.io) - CMS
- [Vercel](https://vercel.com) - Hosting
- [Tailwind CSS](https://tailwindcss.com) - Styling

Typography:

- [Hedvig Letters Serif](https://fonts.google.com/specimen/Hedvig+Letters+Serif)
- [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans)
- [Inconsolata](https://fonts.google.com/specimen/Inconsolata)

---

**Last Updated:** 2025-11-19
**Version:** 2.0.0 - CMS Integration Complete
