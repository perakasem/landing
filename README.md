# Pera Kasemsripitak

## Overview

**Live Site:** https://perakasem.com

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

- **mdsvex**
- **remark-gfm**
- **PostgreSQL**

---

## Architecture

```
┌─────────────────┐
│  Directus CMS   │  (Content editing UI)
│      Render     │
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

- Critical helper functions (arrayToString, formatDate)
- Post sorting and filtering logic
- Tag formatting
- Date conversion utilities

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

- Environment variables
- Database connectivity
- Table structures
- Dependencies
- Type definitions

### CI/CD

GitHub Actions automatically run:

- Type checking
- Unit tests
- Integration tests (if credentials available)
- Build validation
- Health checks

See `.github/workflows/ci.yml` for details.

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
