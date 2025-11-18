# Directus Publish Workflow Configuration

Complete guide to set up a proper draft/publish workflow with visual indicators and publish actions.

---

## Goals

- ✅ Show published status in post list (badges/colors)
- ✅ Don't auto-publish when clicking checkbox
- ✅ Add "Publish" button to post list
- ✅ Clear visual distinction between drafts and published posts
- ✅ Bulk publish multiple posts at once

---

## Step 1: Configure Published Field Display

### Make Published Field Read-Only in Forms

This prevents accidental publishing while editing.

1. Go to **Settings** > **Data Model** > **posts**
2. Click on **published** field
3. Configure:
   - **Interface**: Boolean (not Toggle)
   - **Display**: Badge
   - **Options**:
     - Label: `Status`
     - Icon: Leave empty
     - Color: Conditional based on value
   - **Field**: Set to **Hidden** OR **Read Only** in detail view
   - **Width**: Half
4. Click **Save**

### Configure Display Template for List View

1. In **Settings** > **Data Model** > **posts** (collection settings)
2. Set **Status Field**: `published`
3. This adds a status badge to each post

---

## Step 2: Add Published Status Badge to List View

### Configure Table Layout

1. Go to **Posts** collection
2. Click **Layout Options** (grid icon, top right)
3. Select **Table** layout
4. Click **Configure**
5. Enable these columns (in order):
   - ✅ **Published** (first column for visibility)
   - ✅ Title
   - ✅ Subtitle
   - ✅ Category
   - ✅ Date
   - ✅ Tags
   - ✅ Form

6. Click **Column Display** for **published**:
   - Display: **Badge** or **Label**
   - Enable **Conditional Styles**:
     - When `published = true`: Green background, "Published" text
     - When `published = false`: Orange background, "Draft" text

### Add Visual Indicators with Conditional Formatting

1. In table configuration, click on **published** column
2. Set **Display Template**:
   ```
   {{#if published}}✅ Published{{else}}📝 Draft{{/if}}
   ```

3. Set **Conditional Styles**:
   - **Rule 1**: If `published == true`
     - Background: `#10b981` (green)
     - Text color: `#ffffff` (white)
   - **Rule 2**: If `published == false`
     - Background: `#f59e0b` (orange)
     - Text color: `#ffffff` (white)

---

## Step 3: Create Publish/Unpublish Actions

Directus doesn't have built-in "Publish" buttons in the list view, but we can create a workflow using:

### Option A: Use Batch Update (Simplest)

1. In **Posts** collection (list view)
2. Select posts to publish (checkboxes)
3. Click **Batch Edit** (pencil icon with number)
4. Set `published = true`
5. Click **Save**

**This is the simplest approach and works immediately.**

### Option B: Create Custom Operations (Advanced)

This requires Directus extensions. Here's how to create custom "Publish" and "Unpublish" actions:

#### Create a Directus Flow

1. Go to **Settings** > **Flows**
2. Click **Create Flow**
3. Name: `Publish Posts`
4. Trigger: **Manual** (operation)
5. **Trigger Setup**:
   - Collection: `posts`
   - Location: **Item Page** and **Collection Page**

6. **Add Operation**: Update Data
   - Collection: `posts`
   - IDs: `{{$trigger.body.keys}}`
   - Payload:
     ```json
     {
       "published": true
     }
     ```

7. Click **Save**

8. Repeat for "Unpublish Posts" flow with `"published": false`

**Now you'll have "Publish Posts" and "Unpublish Posts" buttons in the item actions menu!**

---

## Step 4: Create Presets for Draft vs Published Views

### Create "Drafts" Preset

1. In **Posts** collection
2. Click **Filter** icon
3. Add filter: `Published = false`
4. Click **Bookmark** (star icon)
5. Name: `📝 Drafts`
6. Make **Visible to All Users**: Yes
7. Save

### Create "Published" Preset

1. Add filter: `Published = true`
2. Bookmark as: `✅ Published`
3. Save

### Create "All Posts" Preset

1. Clear all filters
2. Bookmark as: `📄 All Posts`
3. Save

**Now you have easy-access filters in the sidebar!**

---

## Step 5: Hide Published Toggle in Create/Edit Forms

If you want to completely remove the published field from forms:

1. **Settings** > **Data Model** > **posts** > **published** field
2. Set **Interface**: Boolean
3. Set **Hidden**: Yes
4. Click **Save**

**Alternative**: Make it read-only so you can see status but not change it:
1. Set **Field** > **Readonly**: Yes
2. Keep **Hidden**: No

---

## Step 6: Configure Workflow (Recommended Setup)

Here's the optimal configuration:

### In Post Edit Form:
- **published** field: **Read-only** (can see status, can't change)
- Shows as: `Status: 📝 Draft` or `Status: ✅ Published`

### In Post List:
- **published** column: First column, badge display
  - `✅ Published` (green) or `📝 Draft` (orange)
- Use **Batch Edit** to publish multiple posts
- Use **Presets** to filter by status

### Publishing Workflow:
1. User creates post → automatically `published = false` (draft)
2. User edits content freely (published field is read-only)
3. When ready to publish:
   - **Option A**: Use Batch Edit → select post(s) → set published = true
   - **Option B**: Edit post → change published toggle → save
   - **Option C**: Use custom Flow button (if configured)

---

## Visual Configuration Summary

### List View Should Look Like:

| Status | Title | Category | Date | Tags |
|--------|-------|----------|------|------|
| <span style="background:green;color:white;padding:4px 8px;">✅ Published</span> | My Post Title | documentary | 2025-02-23 | wildlife, nature |
| <span style="background:orange;color:white;padding:4px 8px;">📝 Draft</span> | Draft Post | essay | 2025-02-24 | reflection |

### Sidebar Should Show:

```
Posts
├── 📄 All Posts (42)
├── ✅ Published (35)
└── 📝 Drafts (7)
```

---

## Implementation Guide

### Quick Setup (5 minutes)

1. **Fix published field display**:
   - Settings > Data Model > posts > published
   - Display: Badge
   - Read-only in forms

2. **Configure table layout**:
   - Posts collection > Layout > Table
   - Enable published column first
   - Set display to badge with conditional colors

3. **Create presets**:
   - Filter by published = true → Bookmark as "Published"
   - Filter by published = false → Bookmark as "Drafts"

4. **Test workflow**:
   - Create new post (should be draft)
   - Use Batch Edit to publish
   - Verify badge shows correctly

### Advanced Setup (15 minutes)

Follow all steps above plus:
1. Create custom Flows for Publish/Unpublish buttons
2. Configure conditional formatting
3. Set up user roles/permissions
4. Add webhooks for publish events (optional)

---

## Alternative: Use Directus Status Field

If you want even more control, you can convert `published` to a proper status field:

### Migration SQL:

```sql
-- Add status field
ALTER TABLE posts ADD COLUMN status TEXT NOT NULL DEFAULT 'draft';

-- Convert existing published boolean to status
UPDATE posts SET status = CASE
    WHEN published = true THEN 'published'
    ELSE 'draft'
END;

-- Optional: Add more statuses
-- UPDATE posts SET status = 'archived' WHERE ... ;

-- Create index
CREATE INDEX idx_posts_status ON posts(status);
```

### Then in Directus:

1. Configure **status** field:
   - Interface: Dropdown
   - Choices: `draft`, `published`, `archived`, `scheduled`
   - Display: Badge with different colors per status

2. This gives you more flexibility:
   - Draft → Published → Archived workflow
   - Scheduled posts (publish on date)
   - Review status, etc.

---

## Troubleshooting

### Published field still editable in forms

**Fix**: Set field to Read-only:
1. Settings > Data Model > posts > published
2. Field > Readonly: Yes
3. Save

### No badge colors in list view

**Fix**: Configure conditional formatting:
1. Posts > Table Layout > Configure
2. Click published column
3. Set Conditional Styles (see Step 2 above)

### Can't batch edit

**Fix**: Check permissions:
1. Settings > Roles & Permissions > Your Role
2. posts collection > Update: Enabled
3. Save

### Presets not showing in sidebar

**Fix**: Make presets visible to all:
1. Posts collection > Click preset (star icon)
2. Edit preset
3. Toggle "Visible to All Users"
4. Save

---

## Best Practices

1. **Always default to draft**: Set `published = false` as default
2. **Use presets**: Make it easy to see drafts vs published
3. **Batch operations**: Publish multiple posts at once
4. **Clear indicators**: Use badges and colors
5. **Read-only in forms**: Prevent accidental status changes
6. **Separate publish action**: Use Batch Edit or custom Flows

---

## Complete Configuration Checklist

### Database
- [ ] Run `supabase-fix-dropdowns.sql` to remove CHECK constraints
- [ ] Verify `published` field is BOOLEAN with default false

### Directus Field Configuration
- [ ] published field: Display = Badge
- [ ] published field: Read-only in forms (or hidden)
- [ ] published field: Conditional colors configured

### List View
- [ ] Table layout shows published column first
- [ ] Badge display with colors (green/orange)
- [ ] Columns properly ordered and sized

### Presets
- [ ] "Drafts" preset created (published = false)
- [ ] "Published" preset created (published = true)
- [ ] "All Posts" preset created (no filter)
- [ ] All presets visible to users

### Workflow (Choose One)
- [ ] Option A: Use Batch Edit for publishing (simplest)
- [ ] Option B: Create custom Flows for Publish buttons (advanced)

### Testing
- [ ] Create new post → defaults to draft
- [ ] Draft shows orange badge in list
- [ ] Can change status via Batch Edit
- [ ] Published shows green badge in list
- [ ] Presets filter correctly

---

## Summary

**Problem**: Toggle immediately saves, no visual indicators
**Solution**: Read-only field + Badge display + Batch Edit + Presets

**Simplest Approach**:
1. Make published field read-only with badge display
2. Use Batch Edit to publish posts
3. Create Draft/Published presets

**Result**: Clear visual workflow with intentional publishing actions! 🎉
