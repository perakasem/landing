# Fix: Directus Interfaces Stuck (Can't Change from Boolean/Text to Dropdown/Badge)

## The Problem

You're experiencing this issue in Directus:

- ✅ Tags field is fixed (working as chips)
- ❌ **form** field stuck as "Text" - can't change to Dropdown
- ❌ **category** field stuck as "Text" - can't change to Dropdown
- ❌ **chapter** field stuck as "Text" - want better formatting
- ❌ **published** field stuck as "Boolean/Checkbox" - can't change to Toggle

When you try to change the interface, **only limited options appear** based on the database column type:
- TEXT columns → Only show Input, Textarea, WYSIWYG, Markdown
- BOOLEAN columns → Only show Boolean, Toggle, Switch

---

## Root Cause

**Directus shows different interface options based on database column type:**

| Database Type | Available Interfaces |
|---------------|---------------------|
| TEXT | Input, Textarea, WYSIWYG, Markdown, Code |
| BOOLEAN | Boolean, Toggle, Switch |
| JSONB | Tags, JSON Editor |
| INTEGER | Input (number), Slider |
| UUID | Input (UUID), Read-only |

**The issue**: Your `form`, `category`, and `chapter` fields are TEXT columns, so Directus doesn't show the **Dropdown** interface in the options.

However, Directus **can** use Dropdown for TEXT fields - we just need to configure it directly in the metadata table.

---

## ✅ Complete Fix (5 minutes)

### Step 1: Configure Directus Fields with Proper Interfaces

Run this SQL in **Supabase SQL Editor**:

1. Go to Supabase Dashboard > **SQL Editor**
2. Click **New Query**
3. Copy and paste the **entire** contents of **`supabase-configure-directus-fields.sql`**
4. Click **Run**

**What this does:**
- ✅ Deletes old field configurations
- ✅ Inserts properly configured fields with correct interfaces:
  - **form**: Dropdown (longform/shortform)
  - **category**: Dropdown with custom values allowed
  - **chapter**: Text input with monospace font
  - **tags**: Tags interface
  - **content**: Markdown code editor
  - **published**: Toggle switch
- ✅ Sets up collection metadata (icon, display template, sort field)

### Step 2: Restart Directus

```bash
docker compose down
docker compose up -d
```

**Wait 20-30 seconds** for Directus to fully start and re-detect the schema.

### Step 3: Verify Configuration in Directus

1. Open Directus: http://localhost:8055
2. Login with admin credentials
3. Go to **Settings** > **Data Model** > **posts**
4. You should see all fields with proper interfaces:
   - **form**: Dropdown (select-dropdown)
   - **category**: Dropdown (select-dropdown)
   - **chapter**: Input (text)
   - **tags**: Tags
   - **content**: Code (markdown)
   - **published**: Boolean (toggle)

### Step 4: Test Everything

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

## Why This Approach Works

### The Problem

**Directus limits interface options based on database column type:**

- TEXT columns in database → Directus only shows: Input, Textarea, WYSIWYG, Code
- BOOLEAN columns → Directus only shows: Boolean, Toggle, Switch

**But** Directus internally **can** use Dropdown for TEXT fields - it just doesn't show it in the UI dropdown because of type filtering.

### The Solution

**Bypass the UI** and directly insert the correct interface configuration into `directus_fields` table.

### Before (Auto-Detected):
```sql
SELECT field, interface FROM directus_fields WHERE collection = 'posts';

form      | input         ← Stuck as text input
category  | input         ← Stuck as text input
chapter   | input         ← Plain text input
published | boolean       ← Checkbox
```

Interface options filtered by database type. Can't change to Dropdown via UI.

### After (Manually Configured):
```sql
SELECT field, interface FROM directus_fields WHERE collection = 'posts';

form      | select-dropdown   ← Now a dropdown! ✅
category  | select-dropdown   ← Now a dropdown! ✅
chapter   | input             ← With monospace font ✅
published | boolean           ← With toggle display ✅
```

Interfaces configured exactly as needed, regardless of database type.

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
