

# JSONB Conversion Guide - Native Directus Dropdowns

## Overview

Convert TEXT fields to JSONB to enable native Tags interface (chip-based selection) in Directus.

**Result**: Get dropdown-like chip selection for `form`, `category`, and `chapter` fields!

---

## 🎯 What You'll Get

### Before (TEXT fields):
```
form:     [longform or shortform________] (plain text input)
category: [documentary, essay, fiction...] (plain text input)
chapter:  ['25___] (plain text input)
```

### After (JSONB fields):
```
form:     [Long Form ▼] (chip selection - only 2 choices)
category: [Documentary ▼] [Fiction ▼] [Essay ▼] ... (chip selection + custom)
chapter:  ['25 ▼] ['24 ▼] ... (chip selection + custom years)
tags:     [tag1] [tag2] [tag3] [+ Add...] (multi-select chips)
```

All fields use the same native Tags interface!

---

## ⚖️ Tradeoffs

### Pros:
- ✅ **Native Directus support** - Tags interface works perfectly with JSONB
- ✅ **Chip-based selection** - Visual, dropdown-like experience
- ✅ **Preset choices** - Can configure allowed values
- ✅ **Consistent interface** - All fields use same Tags UI
- ✅ **No custom extensions** - Built-in Directus functionality
- ✅ **Better UX** - Click to select instead of typing

### Cons:
- ❌ **Array storage** - Values stored as `["longform"]` instead of `"longform"`
- ❌ **App code changes required** - Must handle arrays in frontend
- ❌ **Migration needed** - One-time database conversion
- ❌ **Slightly more complex queries** - Need to handle JSON arrays in SQL

---

## 🚀 Implementation

### Step 1: Convert Database Schema

Run in **Supabase SQL Editor**:

```bash
# Copy supabase-convert-to-jsonb-for-dropdowns.sql
# Run in Supabase Dashboard > SQL Editor
```

**This script will:**
1. Convert `form` from TEXT → JSONB
2. Convert `category` from TEXT → JSONB
3. Convert `chapter` from TEXT → JSONB
4. Migrate all existing data (preserves values)
5. Update indexes for performance
6. Recreate published_posts view

**Data transformation example:**
```sql
-- Before
form: "longform"
category: "documentary"
chapter: "'25"

-- After
form: ["longform"]
category: ["documentary"]
chapter: ["'25"]
```

### Step 2: Configure Directus Interfaces

Run in **Supabase SQL Editor**:

```bash
# Copy supabase-configure-directus-jsonb-fields.sql
# Run in Supabase Dashboard > SQL Editor
```

**This configures:**
- **form**: Tags interface with 2 preset choices (longform, shortform)
- **category**: Tags interface with 5 presets + allow custom values
- **chapter**: Tags interface with year presets + allow custom values
- **tags**: Tags interface (multi-select, already working)

### Step 3: Restart Directus

```bash
docker compose restart

# Wait 30 seconds, then clear cache
docker compose exec directus npx directus cache clear
```

### Step 4: Update App Code

Your SvelteKit app needs to handle arrays instead of strings.

#### In Server-Side Code (`src/lib/server/posts-supabase.ts`):

**Before:**
```typescript
export async function getPosts(): Promise<Post[]> {
    const { data, error } = await db.posts().select('*');

    return (data || []).map((row) => ({
        form: row.form,        // "longform"
        category: row.category, // "documentary"
        chapter: row.chapter,   // "'25"
        tags: row.tags          // ["tag1", "tag2"]
    }));
}
```

**After:**
```typescript
export async function getPosts(): Promise<Post[]> {
    const { data, error } = await db.posts().select('*');

    return (data || []).map((row) => ({
        form: row.form[0],         // ["longform"] → "longform"
        category: row.category[0], // ["documentary"] → "documentary"
        chapter: row.chapter[0],   // ["'25"] → "'25"
        tags: row.tags             // ["tag1", "tag2"] (no change)
    }));
}
```

#### In TypeScript Types (`src/lib/types/database.ts`):

**Update the database types:**
```typescript
export interface Database {
    public: {
        Tables: {
            posts: {
                Row: {
                    // ... other fields
                    form: string[];      // Changed from string
                    category: string[];  // Changed from string
                    chapter: string[];   // Changed from string
                    tags: string[];      // Already array
                };
            };
        };
    };
}
```

#### Alternative: Keep App Types as Strings

If you want to keep your app types simple (strings), do the conversion in the data layer:

```typescript
// src/lib/server/posts-supabase.ts

// Helper function to convert single-element array to string
function arrayToString(arr: string[]): string {
    return arr && arr.length > 0 ? arr[0] : '';
}

export async function getPosts(): Promise<Post[]> {
    const { data, error } = await db.posts().select('*');

    return (data || []).map((row) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        subtitle: row.subtitle,
        form: arrayToString(row.form),           // Convert to string
        category: arrayToString(row.category),   // Convert to string
        chapter: arrayToString(row.chapter),     // Convert to string
        date: row.date,
        tags: row.tags,  // Keep as array
        excerpt: row.excerpt,
        content: row.content,
        published: row.published
    }));
}
```

This way your `Post` type stays the same:
```typescript
export interface Post {
    form: string;      // Still string in app
    category: string;  // Still string in app
    chapter: string;   // Still string in app
    tags: string[];    // Array (as before)
}
```

---

## 🔍 Querying JSONB Fields

### In Supabase/PostgreSQL

**Check if array contains value:**
```sql
-- Find all longform posts
SELECT * FROM posts WHERE form @> '["longform"]'::jsonb;

-- Find documentary posts
SELECT * FROM posts WHERE category @> '["documentary"]'::jsonb;
```

**Extract first element as text:**
```sql
-- Get form as string
SELECT slug, form->>0 AS form_value FROM posts;
-- Returns: "longform", "shortform"
```

### In Supabase Client

```typescript
// Query posts with specific form
const { data } = await supabase
    .from('posts')
    .select('*')
    .contains('form', ['longform']);

// Or use JavaScript filtering after fetch
const posts = await getPosts(); // Already converted to strings
const longformPosts = posts.filter(p => p.form === 'longform');
```

---

## 🎨 Directus UX

### Form Field (Single-select with preset choices only):
```
┌───────────────────────────────────┐
│ Form Type                         │
├───────────────────────────────────┤
│ [Long Form ▼]                     │
│                                   │
│ Choices:                          │
│  • Long Form                      │
│  • Short Form                     │
│                                   │
│ Custom values: Not allowed        │
└───────────────────────────────────┘
```

### Category Field (Single-select with custom values allowed):
```
┌───────────────────────────────────┐
│ Category                          │
├───────────────────────────────────┤
│ [Documentary ▼]                   │
│                                   │
│ Preset choices:                   │
│  • Documentary                    │
│  • Fiction                        │
│  • Essay                          │
│  • Reflection                     │
│  • Review                         │
│                                   │
│ [+ Add custom category]           │
└───────────────────────────────────┘
```

### Chapter Field (Custom allowed with year suggestions):
```
┌───────────────────────────────────┐
│ Chapter                           │
├───────────────────────────────────┤
│ ['25 ▼]                           │
│                                   │
│ Preset choices:                   │
│  • '25 (2025)                     │
│  • '24 (2024)                     │
│  • '23 (2023)                     │
│                                   │
│ [+ Add custom chapter]            │
└───────────────────────────────────┘
```

---

## 🧪 Testing

### After Migration

1. **Verify data conversion:**
```sql
SELECT slug, form, category, chapter, tags FROM posts LIMIT 5;
```

Expected:
```
slug           | form          | category         | chapter  | tags
---------------|---------------|------------------|----------|------------------
shorebirds     | ["longform"]  | ["documentary"]  | ["'25"]  | ["wildlife","...]
fishing-cats   | ["longform"]  | ["documentary"]  | ["'25"]  | ["nature","..."]
```

2. **Test in Directus:**
   - Create new post
   - Select form from chips (Long Form / Short Form)
   - Select category from chips
   - Enter chapter (or select from presets)
   - Add tags
   - Save

3. **Test in app:**
   - Visit `/pond`
   - Verify posts load correctly
   - Check that form, category, chapter display as strings
   - Verify no errors in console

---

## 🔄 Rollback (If Needed)

If you need to revert to TEXT fields:

```sql
-- Rollback: JSONB → TEXT

-- Form
ALTER TABLE posts ADD COLUMN form_text TEXT;
UPDATE posts SET form_text = form->>0;
ALTER TABLE posts DROP COLUMN form;
ALTER TABLE posts RENAME COLUMN form_text TO form;
ALTER TABLE posts ALTER COLUMN form SET NOT NULL;

-- Category
ALTER TABLE posts ADD COLUMN category_text TEXT;
UPDATE posts SET category_text = category->>0;
ALTER TABLE posts DROP COLUMN category;
ALTER TABLE posts RENAME COLUMN category_text TO category;
ALTER TABLE posts ALTER COLUMN category SET NOT NULL;

-- Chapter
ALTER TABLE posts ADD COLUMN chapter_text TEXT;
UPDATE posts SET chapter_text = chapter->>0;
ALTER TABLE posts DROP COLUMN chapter;
ALTER TABLE posts RENAME COLUMN chapter_text TO chapter;
ALTER TABLE posts ALTER COLUMN chapter SET NOT NULL;

-- Recreate indexes
CREATE INDEX idx_posts_form ON posts(form);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_chapter ON posts(chapter);
```

---

## 📊 Comparison with Alternatives

| Approach | Dropdown | Setup | App Changes | Flexibility |
|----------|----------|-------|-------------|-------------|
| **JSONB + Tags** (This approach) | ✅ Chips | Medium | Required | High |
| Input + Placeholders | ❌ | Easy | None | High |
| Related Collections | ✅ True | Hard | Required | Medium |
| Custom Extension | ✅ | Expert | None | Low |

---

## 🎯 Recommendation

**This JSONB approach is recommended if:**
- ✅ You want native Directus dropdown-like functionality
- ✅ You're comfortable with one-time app code updates
- ✅ You prefer visual chip selection over typing
- ✅ You want preset choices to guide content creation

**Stick with TEXT + Input if:**
- ❌ You want to avoid app code changes
- ❌ You prefer maximum simplicity
- ❌ You're okay with text input fields

---

## 🚀 Quick Start

```bash
# 1. Run schema conversion
# Copy supabase-convert-to-jsonb-for-dropdowns.sql → Run in Supabase

# 2. Configure Directus fields
# Copy supabase-configure-directus-jsonb-fields.sql → Run in Supabase

# 3. Restart Directus
docker compose restart
docker compose exec directus npx directus cache clear

# 4. Update app code
# Add arrayToString() helper to posts-supabase.ts

# 5. Test thoroughly
npm run dev
# Check /pond, create test post in Directus

# 6. Deploy
git add .
git commit -m "feat: convert to JSONB for Directus dropdowns"
git push
```

---

## Summary

**What changes:**
- Database: TEXT → JSONB (arrays)
- Directus: Input → Tags (chips)
- App code: Add array handling

**What you get:**
- ✅ Native dropdown-like chip selection
- ✅ Preset choices for consistency
- ✅ Better UX in Directus
- ✅ Visual selection instead of typing

**Effort:**
- ~30 minutes for migration + app code updates
- One-time change
- Well worth it for improved editing experience!

---

This approach gives you the best of both worlds: native Directus support without complex relationship tables!
