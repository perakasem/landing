# Directus Dropdown Alternatives for TEXT Fields

## The Limitation

**Directus does NOT support dropdown/select interfaces for TEXT fields.**

Available interfaces by database type:
- **TEXT**: Input, Textarea, WYSIWYG, Markdown, Code only
- **JSONB**: Tags, JSON editor
- **Relationships**: Dropdown (via M2O, O2M, M2M)

For `form`, `category`, and `chapter` fields (which are TEXT), we cannot use a traditional dropdown interface.

---

## ✅ Solution Options

### Option 1: Input Fields with Placeholders (Simplest - RECOMMENDED)

**Current approach** - Uses input fields with helpful placeholders.

**Pros:**
- ✅ Works immediately
- ✅ No schema changes needed
- ✅ Simple and flexible
- ✅ Users can type any value

**Cons:**
- ❌ No dropdown selection
- ❌ No validation (users can enter anything)
- ❌ Typos possible

**Implementation:**
Run `supabase-configure-directus-fields-corrected.sql` (already created)

**Result:**
```
form: [longform or shortform_________] (text input)
category: [documentary, fiction, essay...] (text input)
```

---

### Option 2: Create Related Collections (True Dropdowns)

Convert TEXT fields to use Directus relationships, which DO support dropdowns.

#### Step 1: Create Collections for Dropdowns

Run this SQL in Supabase:

```sql
-- Create forms collection
CREATE TABLE forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    sort INTEGER
);

INSERT INTO forms (name, label, sort) VALUES
('longform', 'Long Form', 1),
('shortform', 'Short Form', 2);

-- Create categories collection
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    description TEXT,
    sort INTEGER
);

INSERT INTO categories (name, label, sort) VALUES
('documentary', 'Documentary', 1),
('fiction', 'Fiction', 2),
('essay', 'Essay', 3),
('reflection', 'Reflection', 4),
('review', 'Review', 5);

-- Enable RLS
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view forms" ON forms FOR SELECT USING (true);
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);

-- Modify posts table to use relationships
ALTER TABLE posts ADD COLUMN form_id UUID REFERENCES forms(id);
ALTER TABLE posts ADD COLUMN category_id UUID REFERENCES categories(id);

-- Migrate existing data
UPDATE posts SET form_id = forms.id
FROM forms WHERE posts.form = forms.name;

UPDATE posts SET category_id = categories.id
FROM categories WHERE posts.category = categories.name;

-- Once verified, drop old TEXT columns
-- ALTER TABLE posts DROP COLUMN form;
-- ALTER TABLE posts DROP COLUMN category;
```

#### Step 2: Configure in Directus

1. Restart Directus: `docker compose restart`
2. Go to Settings > Data Model
3. Configure **form_id** field:
   - Interface: **Many-to-One** (Dropdown!)
   - Related Collection: forms
   - Display Template: `{{label}}`
4. Configure **category_id** field:
   - Interface: **Many-to-One** (Dropdown!)
   - Related Collection: categories
   - Display Template: `{{label}}`

**Pros:**
- ✅ True dropdown interface
- ✅ Data validation (only allowed values)
- ✅ Can manage forms/categories in Directus
- ✅ Reusable across collections

**Cons:**
- ❌ More complex setup
- ❌ Schema migration required
- ❌ Need to update app code to handle relationships
- ❌ More database tables to manage

---

### Option 3: Client-Side Validation Only

Keep TEXT fields with Input interface, add validation rules in Directus.

#### Configure Validation

1. Go to Settings > Data Model > posts > **form**
2. Scroll to **Validation**
3. Add validation rule:
   - Type: **Regex**
   - Pattern: `^(longform|shortform)$`
   - Message: "Must be either 'longform' or 'shortform'"

4. For **category**:
   - Pattern: `^(documentary|fiction|essay|reflection|review)$`
   - Message: "Must be a valid category"

**Pros:**
- ✅ Simple setup
- ✅ Validates user input
- ✅ No schema changes

**Cons:**
- ❌ Still no dropdown (typing required)
- ❌ Validation only shows after save attempt
- ❌ User must know valid values

---

### Option 4: Use Directus Custom Extension

Create a custom Directus interface extension that adds dropdown for TEXT fields.

**Complexity:** Advanced (requires JavaScript/Vue.js knowledge)

See: https://docs.directus.io/extensions/interfaces.html

---

## 📊 Comparison

| Approach | Difficulty | Dropdown | Validation | Schema Changes |
|----------|-----------|----------|------------|----------------|
| Input + Placeholders | ⭐ Easy | ❌ | ❌ | ❌ None |
| Validation Rules | ⭐⭐ Medium | ❌ | ✅ | ❌ None |
| Related Collections | ⭐⭐⭐ Hard | ✅ | ✅ | ✅ Required |
| Custom Extension | ⭐⭐⭐⭐ Expert | ✅ | ✅ | ❌ None |

---

## 🎯 Recommended Approach

For your use case, I recommend **Option 1** (Input + Placeholders):

**Why:**
- Simple and works immediately
- Form only has 2 values (longform/shortform) - easy to remember
- Category has 5 common values - not too many to remember
- You're the primary user - typos are less of a concern
- Flexibility to add new categories without schema changes

**Implementation:**
1. Run `supabase-configure-directus-fields-corrected.sql`
2. Restart Directus
3. Fields will have helpful placeholders showing valid values

---

## 🔄 Migration Path

If you want dropdowns later, you can migrate to Option 2 (Related Collections):

1. Start with Option 1 (simple input)
2. Use the site for a while
3. If you find yourself needing strict validation or dropdowns, migrate to Option 2
4. The migration SQL preserves all existing data

---

## Current Configuration

After running `supabase-configure-directus-fields-corrected.sql`:

```
┌─────────────┬──────────────┬─────────────────────────────────────┐
│ Field       │ Interface    │ Experience                          │
├─────────────┼──────────────┼─────────────────────────────────────┤
│ form        │ input        │ [longform or shortform_____]        │
│ category    │ input        │ [documentary, fiction, essay...]    │
│ chapter     │ input        │ ['25_____] (monospace)             │
│ tags        │ tags         │ [tag1] [tag2] [+ Add...]           │
│ content     │ input-code   │ # Markdown editor...                │
│ published   │ boolean      │ [👁️ Toggle ⚪]                      │
└─────────────┴──────────────┴─────────────────────────────────────┘
```

Clean, functional, and works within Directus's limitations.

---

## Next Steps

**To implement Option 1 (recommended):**
```bash
# 1. Run the corrected SQL in Supabase
# Copy supabase-configure-directus-fields-corrected.sql

# 2. Restart Directus
docker compose restart

# 3. Test in Directus
# All fields should work with appropriate interfaces
```

**To implement Option 2 (true dropdowns):**
See the "Create Related Collections" section above for complete SQL migration.

---

## Summary

**Problem**: Directus doesn't support dropdown interface for TEXT fields
**Root Cause**: Directus architecture limitation - dropdowns only work with relationships
**Best Solution**: Use Input fields with placeholders (simple, works now)
**Future Option**: Migrate to related collections if dropdowns become necessary

The corrected script uses only valid Directus interfaces that will work immediately.
