# Fix: Directus Interfaces Stuck (Can't Change from Boolean/Text to Dropdown/Badge)

## The Problem

You're experiencing this issue in Directus:

- ✅ Tags field is fixed (working as chips)
- ❌ **form** field stuck as "Text" - can't change to Dropdown
- ❌ **category** field stuck as "Text" - can't change to Dropdown
- ❌ **published** field stuck as "Boolean/Checkbox" - can't change to Badge/Toggle

When you try to change the interface, the options are greyed out or don't work.

---

## Root Cause

**Directus caches field metadata** in its own internal tables (`directus_fields`).

Even though you've fixed the database schema (removed CHECK constraints, converted tags to JSONB), **Directus is still using old cached metadata** from when it first connected to your database.

This metadata locks the interface types to what Directus originally detected.

---

## ✅ Complete Fix (5 minutes)

### Step 1: Reset Directus Field Metadata

Run this SQL in **Supabase SQL Editor**:

1. Go to Supabase Dashboard > **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of **`supabase-reset-directus-metadata.sql`**
4. Click **Run**

**What this does:**
- ✅ Deletes Directus's cached field configurations for the posts collection
- ✅ Forces Directus to re-detect all fields fresh from the database
- ✅ Verifies database schema is correct (no CHECK constraints)

### Step 2: Restart Directus

```bash
docker compose down
docker compose up -d
```

**Wait 20-30 seconds** for Directus to fully start and re-detect the schema.

### Step 3: Verify Fields Are Now Configurable

1. Open Directus: http://localhost:8055
2. Login with admin credentials
3. Go to **Settings** > **Data Model** > **posts**
4. Click on **form** field
5. **Interface** dropdown should now show all options:
   - Input ✅
   - Dropdown ✅ (select this!)
   - Select ✅
   - etc.

6. Click on **published** field
7. **Interface** dropdown should now show:
   - Boolean ✅
   - Toggle ✅ (select this!)
   - Switch ✅
   - Badge ✅

### Step 4: Configure Interfaces Properly

Now configure each field:

#### Form Field (Was Stuck as Text)

1. **Settings** > **Data Model** > **posts** > **form**
2. **Interface**: Dropdown
3. **Choices**:
   - Click **+ Add Choice**
   - Value: `longform`, Text: `Long Form`
   - Click **+ Add Choice**
   - Value: `shortform`, Text: `Short Form`
4. **Allow Other**: OFF
5. **Allow None**: OFF
6. **Icon**: `category`
7. Click **Save**

#### Category Field (Was Stuck as Text)

**Option A: Keep as Input (Freeform Text)**
1. **Interface**: Input
2. **Placeholder**: `documentary, essay, etc.`
3. **Trim**: ON

**Option B: Convert to Dropdown (Predefined Categories)**
1. **Interface**: Dropdown
2. **Choices**:
   - `documentary`
   - `fiction`
   - `essay`
   - `reflection`
   - `review`
3. **Allow Other**: ON (allows new categories)
4. **Icon**: `label`
5. Click **Save**

#### Published Field (Was Stuck as Boolean)

**For Read-Only Badge (Recommended for Publish Workflow)**
1. **Interface**: Badge
2. **Display Template**:
   ```
   {{#if published}}✅ Published{{else}}📝 Draft{{/if}}
   ```
3. **Field** > **Readonly**: YES
4. Click **Save**

**OR Toggle (If You Want Click-to-Publish)**
1. **Interface**: Toggle
2. **Label**: `Published Status`
3. **Icon On**: Search `visibility` → select
4. **Icon Off**: Search `visibility_off` → select
5. **Color**: Brand (green)
6. Click **Save**

### Step 5: Test Everything

1. Go to **Posts** collection
2. Click **Create Item** or edit existing post
3. Verify:
   - **form**: Shows dropdown with Long Form / Short Form ✅
   - **category**: Shows input or dropdown ✅
   - **published**: Shows toggle/badge (not checkbox) ✅
   - **tags**: Still working as chips ✅
4. Try changing values and saving
5. Should work without errors! 🎉

---

## What This Fix Does

### Before:
```
Directus Internal Metadata (directus_fields table):
- form: interface = "input", type = "text" [CACHED - STUCK]
- published: interface = "boolean", type = "boolean" [CACHED - STUCK]
- category: interface = "input", type = "text" [CACHED - STUCK]
```

Interface dropdown shows only the cached type, can't change.

### After:
```
Directus Internal Metadata (directus_fields table):
- [DELETED - Empty]

Directus re-detects from database:
- form: type = "text" → Interface dropdown shows ALL options ✅
- published: type = "boolean" → Interface dropdown shows Toggle, Badge, etc. ✅
- category: type = "text" → Interface dropdown shows Input, Dropdown, etc. ✅
```

All interface options are now available!

---

## Alternative: Manual Deletion via Directus

If you prefer to use Directus's interface:

1. Go to **Settings** > **Data Model** > **posts**
2. For each stuck field:
   - Click field name
   - Scroll to bottom
   - Click **Delete Field** (⚠️ this only deletes metadata, not the database column)
3. Click **Refresh** or reload page
4. Directus will re-detect the field
5. Configure interface as desired

**Warning**: This is more tedious than the SQL approach.

---

## Verification Queries

### Check Directus Field Metadata

Run in Supabase to see what Directus has stored:

```sql
SELECT
    field,
    interface,
    special,
    options
FROM directus_fields
WHERE collection = 'posts'
ORDER BY sort;
```

**After reset, this should return 0 rows** (or show newly configured fields after you save them in Directus).

### Check Database Schema

```sql
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'posts'
ORDER BY ordinal_position;
```

Verify:
- `form`: `text` (no CHECK constraint)
- `category`: `text`
- `published`: `boolean`
- `tags`: `jsonb`

---

## Common Issues After Reset

### Issue: Fields reappear but still stuck

**Cause**: Directus cache not cleared
**Fix**:
```bash
docker compose exec directus npx directus cache clear
docker compose restart
```

### Issue: Fields disappeared completely

**Cause**: Directus hasn't re-detected them yet
**Fix**:
1. Settings > Data Model > Click **Refresh** button
2. Or restart Directus: `docker compose restart`
3. Wait 30 seconds and refresh browser

### Issue: Can change interface but get errors when saving

**Cause**: Database type mismatch
**Fix**:
1. For **form**: Verify no CHECK constraint exists
2. For **tags**: Verify column is JSONB (not TEXT[])
3. Run verification queries above

### Issue: "directus_fields table not found"

**Cause**: You ran the SQL against wrong database or Directus hasn't created its tables yet
**Fix**:
1. Verify you're in the correct Supabase project
2. Check Directus has fully initialized:
   ```sql
   SELECT tablename FROM pg_tables WHERE tablename LIKE 'directus%';
   ```
   Should show multiple directus_ tables

---

## Complete Reset (Nuclear Option)

If the above doesn't work, you can completely reset Directus's metadata:

**⚠️ WARNING: This resets ALL Directus configuration, not just posts fields!**

### Option 1: Delete All Directus Metadata

```sql
-- Delete ALL Directus field metadata
DELETE FROM directus_fields;

-- Delete collection metadata
DELETE FROM directus_collections WHERE collection = 'posts';

-- Restart Directus
-- It will re-detect everything
```

### Option 2: Rebuild Directus Database

```bash
# Stop Directus
docker compose down

# Clear Directus's database (only if using separate DB)
# If using same Supabase DB, skip this step

# Remove Directus volume (if using Docker volumes)
docker volume ls | grep directus
docker volume rm <volume-name>

# Start fresh
docker compose up -d
```

---

## Prevention for Future

To avoid this issue in the future:

1. **Set up schema correctly first** before connecting Directus
2. **Use Directus-compatible types**:
   - JSONB for arrays (not TEXT[])
   - TEXT for dropdowns (not ENUM)
   - Avoid CHECK constraints (use Directus validation)

3. **When changing schema**:
   - Delete field metadata in Directus before changing DB
   - Or use the reset script after DB changes

---

## Summary

**Problem**: Directus cached old field metadata, locking interface types

**Solution**: Delete cached metadata → Restart Directus → Reconfigure interfaces

**Steps**:
1. Run `supabase-reset-directus-metadata.sql`
2. Restart Directus
3. Configure interfaces (now all options available)
4. Test and save

**Result**: All fields fully configurable with any interface type! ✅

---

## Next Steps After Fix

Once interfaces are working:

1. ✅ Configure all field interfaces properly
2. ✅ Set up publish workflow (see `DIRECTUS-PUBLISH-WORKFLOW.md`)
3. ✅ Create presets for Drafts/Published
4. ✅ Configure table layout with badges
5. 🎉 Start using Directus!

---

Need help? Check Directus logs:
```bash
docker compose logs directus --tail 100
```

Look for errors related to field detection or schema introspection.
