# Database Schema

This directory contains all database-related SQL scripts for the Supabase PostgreSQL database.

## Files

### `schema.sql`
**Main database schema** - Run this first to create all tables and set up RLS policies.

Contains:
- `posts` table - Blog post content
- `site_config` table - Site-wide configuration (singleton)
- Indexes for performance
- Triggers for auto-updating timestamps
- Row Level Security (RLS) policies
- Verification queries

**Usage:**
```bash
# In Supabase SQL Editor
# Copy and paste the entire file and execute
```

### `create-site-config-table.sql`
Standalone script to create just the `site_config` table.

Use this if you need to add site config to an existing database that already has the posts table.

### `reset-directus-metadata.sql`
Troubleshooting script to reset Directus cached metadata.

**When to use:**
- Directus shows wrong schema for site_config
- Fields are missing in Directus UI
- After modifying database schema outside of Directus

**Usage:**
1. Run this script in Supabase SQL Editor
2. Refresh Directus admin panel
3. Directus will re-detect the correct schema

## Database Structure

### Posts Table
```sql
posts (
    id UUID PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    form JSONB,        -- ["longform"] or ["shortform"]
    category JSONB,    -- ["documentary"], ["fiction"], etc.
    chapter JSONB,     -- ["'25"], etc.
    tags JSONB,        -- ["tag1", "tag2", ...]
    date DATE,
    excerpt TEXT,
    content TEXT,
    published BOOLEAN,
    featured_image TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
```

**JSONB Pattern:**
- Database stores: `["longform"]`, `["documentary"]`, `["'25"]`
- App converts to: `"longform"`, `"documentary"`, `"'25"`
- This pattern is required for Directus Tags interface compatibility

### Site Config Table (Singleton)
```sql
site_config (
    id UUID PRIMARY KEY,
    title TEXT,
    description TEXT,
    current_chapter TEXT,
    base_url TEXT,
    watch_url TEXT,
    watch_title TEXT,
    watch_source TEXT,
    media_url TEXT,
    media_title TEXT,
    media_source TEXT,
    read_url TEXT,
    read_title TEXT,
    read_source TEXT,
    artwork_src TEXT,
    artwork_title TEXT,
    artwork_artist TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
```

**Singleton Pattern:**
- Only one row exists (UUID: `00000000-0000-0000-0000-000000000001`)
- Managed via Directus CMS
- Used for site-wide configuration

## Row Level Security (RLS)

Both tables have RLS enabled with the following policies:

### Posts Table
- **Public:** Read access to published posts only
- **Authenticated:** Full CRUD access (for Directus)

### Site Config Table
- **Public:** Read access to all config
- **Authenticated:** Update access (for Directus)

## Indexes

Performance indexes created:
- `posts.slug` - Fast slug lookups
- `posts.published` - Filter published posts
- `posts.date` - Sort by date
- `posts.chapter`, `posts.category`, `posts.tags` - GIN indexes for JSONB queries

## Triggers

Auto-update triggers:
- `posts.updated_at` - Updates on every row modification
- `site_config.updated_at` - Updates on every row modification

## Type Generation

After modifying the schema, regenerate TypeScript types:

```bash
npx supabase gen types typescript \
    --project-id YOUR_PROJECT_ID \
    > src/lib/types/database.ts
```

## Related Documentation

- `/ARCHITECTURE.md` - Technical architecture details
- `/CMS-GUIDE.md` - Directus CMS setup and usage
- `/src/lib/server/posts-supabase.ts` - Database query functions
