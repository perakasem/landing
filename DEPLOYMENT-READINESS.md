# Deployment Readiness Checklist

**Status**: Ready for deployment after JSONB conversion
**Date**: 2025-11-18

---

## ✅ Completed Server-Side Changes

### 1. Database Type Definitions Updated
**File**: `src/lib/types/database.ts`

- ✅ Updated `form`, `category`, `chapter` fields to `string[]` (JSONB arrays)
- ✅ Updated both `Row`, `Insert`, and `Update` types
- ✅ Updated `published_posts` view types
- ✅ Added inline comments explaining array format

**Result**: TypeScript now correctly reflects database schema with JSONB arrays.

### 2. Server-Side Post Loading Updated
**File**: `src/lib/server/posts-supabase.ts`

- ✅ Added `arrayToString()` helper function to convert JSONB arrays → strings
- ✅ Added `stringToArray()` helper function to convert strings → JSONB arrays
- ✅ Updated `getPosts()` to convert arrays to strings
- ✅ Updated `getAllPosts()` to convert arrays to strings
- ✅ Updated `getPostBySlug()` to convert arrays to strings
- ✅ Added inline comments explaining conversion

**Result**: App code works with strings while database uses JSONB arrays.

### 3. Migration Script Updated
**File**: `scripts/migrate-posts-to-supabase.ts`

- ✅ Added `stringToArray()` helper function
- ✅ Updated insert logic to convert strings → arrays
- ✅ Updated update logic to convert strings → arrays
- ✅ Tags remain as arrays (multi-value field)

**Result**: Migration script correctly converts markdown data to JSONB format.

---

## 🔄 Required Database Migration Steps

**Before deployment, you MUST run these SQL scripts in order:**

### Step 1: Convert Database Fields to JSONB
```bash
# Run in Supabase SQL Editor
# File: supabase-convert-to-jsonb-for-dropdowns.sql
```

**What it does:**
- Converts `form`, `category`, `chapter` from TEXT → JSONB
- Migrates existing data: "longform" → ["longform"]
- Updates indexes for performance
- Recreates `published_posts` view

**Time**: ~1 minute
**Rollback available**: Yes (see guide)

### Step 2: Configure Directus Field Interfaces
```bash
# Run in Supabase SQL Editor
# File: supabase-configure-directus-jsonb-fields.sql
```

**What it does:**
- Configures Tags interface for form, category, chapter
- Sets preset choices (longform/shortform, documentary/fiction/etc.)
- Enables chip-based selection in Directus

**Time**: ~30 seconds

### Step 3: Restart Directus
```bash
docker compose restart
docker compose exec directus npx directus cache clear
```

**Time**: ~30 seconds

---

## 📋 Deployment Checklist

### Pre-Deployment (Database Setup)

- [ ] **Run JSONB conversion SQL** (`supabase-convert-to-jsonb-for-dropdowns.sql`)
- [ ] **Verify data migration**:
  ```sql
  SELECT slug, form, category, chapter, tags FROM posts LIMIT 3;
  -- Should show: ["longform"], ["documentary"], ["'25"], ["tag1", "tag2"]
  ```
- [ ] **Run Directus config SQL** (`supabase-configure-directus-jsonb-fields.sql`)
- [ ] **Restart Directus** and verify fields show as chips
- [ ] **Test creating a post in Directus** with chip selection

### Application Deployment

- [ ] **Commit server-side changes**:
  ```bash
  git add src/lib/types/database.ts
  git add src/lib/server/posts-supabase.ts
  git add scripts/migrate-posts-to-supabase.ts
  git commit -m "feat: update server code for JSONB arrays (Directus dropdown support)"
  git push origin your-branch
  ```

- [ ] **Set environment variables** on hosting platform:
  ```bash
  PUBLIC_SUPABASE_URL=https://mipgedcytuqbdmdppdzm.supabase.co
  PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
  ```

- [ ] **Deploy application**
  - Vercel: `vercel --prod`
  - Netlify: `netlify deploy --prod`
  - Or push to main branch if auto-deploy is configured

- [ ] **Verify deployment**:
  - Visit `/pond` route
  - Check posts load correctly
  - Verify form, category, chapter display as strings (not arrays)
  - Check tags display correctly

### Post-Deployment Verification

- [ ] **Test Directus CMS**:
  - Login to Directus
  - Edit existing post
  - Verify chip selection for form, category, chapter
  - Save changes
  - Verify changes appear on website

- [ ] **Test creating new post**:
  - Create post in Directus
  - Select form via chips
  - Select category via chips
  - Add tags
  - Publish
  - Verify appears on website

- [ ] **Verify all routes work**:
  - `/pond` - Post listing
  - `/pond/[slug]` - Individual posts
  - `/pond/archive` - Archive page
  - `/api/posts` - JSON API
  - `/rss.xml` - RSS feed

---

## 🎯 What's Different After Deployment

### In Database:
```sql
-- Before (TEXT)
form: "longform"
category: "documentary"
chapter: "'25"

-- After (JSONB)
form: ["longform"]
category: ["documentary"]
chapter: ["'25"]
```

### In Directus UI:
```
Before: [longform________] (plain text input)
After:  [Long Form ▼] (chip selection dropdown)

Before: [documentary_____] (plain text input)
After:  [Documentary ▼] [Fiction ▼] [Essay ▼] (chip selection)
```

### In Application Code:
```typescript
// No changes needed!
// Conversion happens in posts-supabase.ts
post.form === "longform" // Still works
post.category === "documentary" // Still works
post.chapter === "'25" // Still works
```

---

## 🆘 Troubleshooting

### Issue: Posts not loading after deployment

**Check 1**: Verify environment variables are set
```bash
echo $PUBLIC_SUPABASE_URL
echo $PUBLIC_SUPABASE_ANON_KEY
```

**Check 2**: Verify database migration ran successfully
```sql
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'posts' AND column_name IN ('form', 'category', 'chapter');
-- Should show: jsonb, jsonb, jsonb
```

**Check 3**: Check browser console for errors

### Issue: Posts showing as arrays on website

**Problem**: Conversion not happening in posts-supabase.ts

**Fix**: Verify `arrayToString()` is being called:
```typescript
// Should have these lines:
form: arrayToString(row.form),
category: arrayToString(row.category),
chapter: arrayToString(row.chapter),
```

### Issue: Can't save posts in Directus

**Problem**: Field interfaces not configured correctly

**Fix**: Re-run `supabase-configure-directus-jsonb-fields.sql` and restart Directus

---

## 📚 Documentation Reference

- **JSONB Conversion Guide**: `DIRECTUS-JSONB-CONVERSION-GUIDE.md`
- **Dropdown Alternatives**: `DIRECTUS-DROPDOWN-ALTERNATIVES.md`
- **Publish Workflow**: `DIRECTUS-PUBLISH-WORKFLOW.md`
- **Field Configuration**: `DIRECTUS-FIELD-CONFIG.md`

---

## 🎉 Summary

**What was done:**
1. ✅ Updated TypeScript types for JSONB arrays
2. ✅ Added conversion helpers (arrayToString, stringToArray)
3. ✅ Updated all post loading functions
4. ✅ Updated migration script

**What you need to do:**
1. 🔄 Run JSONB conversion SQL in Supabase
2. 🔄 Run Directus config SQL in Supabase
3. 🔄 Restart Directus
4. 🔄 Deploy application with updated code

**Result after deployment:**
- ✅ Native chip-based selection in Directus (dropdown-like UX)
- ✅ App continues to work with strings (no frontend changes)
- ✅ Better content creation experience
- ✅ Data validation via preset choices

---

**Ready to deploy!** Follow the checklist above to complete deployment.
