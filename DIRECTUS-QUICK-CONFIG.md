# Directus Quick Configuration Cheat Sheet

**Goal**: Configure Posts collection for optimal editing experience

**Time**: 5-10 minutes

> **Note**: For proper draft/publish workflow with visual indicators and publish buttons, see [`DIRECTUS-PUBLISH-WORKFLOW.md`](./DIRECTUS-PUBLISH-WORKFLOW.md)

---

## 🎯 What You'll Get

- ✅ Tags shown as colorful chips (not text boxes)
- ✅ Large markdown editor with syntax highlighting
- ✅ Proper field sizes (no excessive scrolling)
- ✅ Organized layout with sections

---

## 📋 Step-by-Step Checklist

### Initial Setup

- [ ] Open Directus: http://localhost:8055
- [ ] Login with your admin credentials
- [ ] Click **Settings** (gear icon) in sidebar
- [ ] Click **Data Model**
- [ ] Click **posts** collection

### Collection Settings

- [ ] Set **Icon**: Click icon dropdown → search "article" → select
- [ ] Set **Display Template**: `{{title}}`
- [ ] Set **Sort Field**: Dropdown → select `date` → descending
- [ ] Click **Save** (checkmark icon)

### Configure Critical Fields

Click on each field name in the list to open its configuration:

#### 1. tags ⭐ (Most Important)

**IMPORTANT**: If you get a "malformed array literal" error when saving posts, see [`DIRECTUS-TAGS-FIX.md`](./DIRECTUS-TAGS-FIX.md) - you need to convert the tags column from TEXT[] to JSONB.

- [ ] Click **tags** field
- [ ] **Interface** dropdown → select **Tags**
- [ ] Scroll to **Options** section
- [ ] Toggle ON: **Alphabetize**
- [ ] Toggle ON: **Allow Custom Values**
- [ ] **Whitespace** dropdown → select **Trim**
- [ ] **Capitalization** dropdown → select **Lowercase**
- [ ] **Placeholder**: `Add tags...`
- [ ] Click **Save**

#### 2. content ⭐ (Most Important)

- [ ] Click **content** field
- [ ] **Interface** dropdown → select **Input Code**
- [ ] **Language** dropdown → select **Markdown**
- [ ] Toggle ON: **Line Numbers**
- [ ] Toggle ON: **Line Wrapping**
- [ ] Click **Save**

**Alternative (if you have Markdown extension):**
- [ ] **Interface** dropdown → select **Markdown**
- [ ] Enable all toolbar options
- [ ] Toggle ON: **Preview**

#### 3. published ⭐

- [ ] Click **published** field
- [ ] **Interface** dropdown → select **Toggle**
- [ ] **Label**: `Published`
- [ ] **Icon On**: Search `visibility` → select
- [ ] **Icon Off**: Search `visibility_off` → select
- [ ] **Color**: Select brand color (blue/green)
- [ ] Click **Save**

#### 4. form

- [ ] Click **form** field
- [ ] **Interface** dropdown → select **Dropdown**
- [ ] Click **+ Add Choice**
  - **Value**: `longform`
  - **Text**: `Long Form`
  - **Icon**: Search `article` → select
- [ ] Click **+ Add Choice** again
  - **Value**: `shortform`
  - **Text**: `Short Form`
  - **Icon**: Search `notes` → select
- [ ] **Placeholder**: `Select form type`
- [ ] Click **Save**

#### 5. date

- [ ] Click **date** field
- [ ] **Interface** dropdown → select **DateTime**
- [ ] **Type** dropdown → select **Date** (not datetime)
- [ ] Toggle ON: **Use 24-Hour Format**
- [ ] Click **Save**

#### 6. excerpt

- [ ] Click **excerpt** field
- [ ] **Interface** dropdown → select **Textarea**
- [ ] **Rows**: `4`
- [ ] **Placeholder**: `Brief summary (1-2 sentences)`
- [ ] Click **Save**

#### 7. title

- [ ] Click **title** field
- [ ] **Interface**: Input (should already be set)
- [ ] **Placeholder**: `Enter post title`
- [ ] Toggle ON: **Trim**
- [ ] **Width** dropdown → select **Full**
- [ ] Click **Save**

#### 8. subtitle

- [ ] Click **subtitle** field
- [ ] **Interface**: Input
- [ ] **Placeholder**: `Enter subtitle (optional)`
- [ ] **Width** dropdown → select **Full**
- [ ] Click **Save**

#### 9. slug

- [ ] Click **slug** field
- [ ] **Interface**: Input
- [ ] **Placeholder**: `post-slug`
- [ ] **Font** dropdown → select **Monospace**
- [ ] Toggle ON: **Trim**
- [ ] **Width** dropdown → select **Half**
- [ ] Click **Save**

#### 10. category

- [ ] Click **category** field
- [ ] **Interface**: Input
- [ ] **Placeholder**: `documentary, essay, etc.`
- [ ] Toggle ON: **Trim**
- [ ] **Width** dropdown → select **Half**
- [ ] Click **Save**

#### 11. chapter

- [ ] Click **chapter** field
- [ ] **Interface**: Input
- [ ] **Placeholder**: `'25, '24, etc.`
- [ ] **Font** dropdown → select **Monospace**
- [ ] **Width** dropdown → select **Half**
- [ ] Click **Save**

### Organize Layout (Optional but Recommended)

- [ ] Click **Fields & Layout** tab in posts collection
- [ ] Drag fields to create this order:
  1. title
  2. subtitle
  3. slug
  4. form
  5. category
  6. chapter
  7. date
  8. published
  9. tags
  10. excerpt
  11. content

### Configure Table View

- [ ] Go to **Posts** collection (click "Posts" in sidebar)
- [ ] Click **layout icon** (grid) in top right
- [ ] Select **Table** layout
- [ ] Click **Configure** (gear icon)
- [ ] Enable these columns:
  - ✅ title
  - ✅ category
  - ✅ date
  - ✅ tags
  - ✅ published
  - ❌ content (too large)
- [ ] Click **Save**

---

## ✅ Test Your Configuration

- [ ] Click **Posts** in sidebar
- [ ] Click **Create Item** (+) button
- [ ] Verify:
  - **tags**: Shows as chip input (type and press Enter)
  - **content**: Large code editor with line numbers
  - **published**: Shows as toggle switch
  - **form**: Shows as dropdown with icons
  - **date**: Calendar picker opens
- [ ] Try creating a test post
- [ ] Save and verify it appears in list view

---

## 🎨 Expected Result

### When Creating a Post:

**Tags Field:**
```
[documentary] [wildlife] [+ Add tag...]
```
Not: `documentary, wildlife` (plain text)

**Content Field:**
```
1  # Heading
2
3  This is content with **markdown** syntax highlighting
4
5  - List item
```
Large editor, no cramped scrolling

**Published Field:**
```
[👁️ Published  ⚪→]  (toggle switch)
```
Not: `☑️ published` (checkbox)

---

## 📌 Quick Tips

- **Reorder fields**: Drag and drop in Fields & Layout
- **Change field width**: Edit field → Width dropdown → Half/Full
- **Group fields**: Create visual sections by ordering related fields together
- **Hide system fields**: Edit field → toggle "Hidden"
- **Required fields**: Edit field → toggle "Required" → asterisk appears

---

## 🆘 Troubleshooting

**Tags still showing as text input?**
- Go to field → Interface → make sure "Tags" is selected (not "Input")
- Preset should be "tags"

**Content field too small?**
- Interface → Input Code → should auto-expand
- Or set minimum height in advanced options

**Can't find Markdown interface?**
- Use "Input Code" with Language: Markdown
- Or install: `npm install directus-extension-markdown-interface`

**Published showing as checkbox?**
- Interface must be "Toggle" (not "Boolean")

---

## ⏱️ Time Estimates

- Collection settings: 1 minute
- Configure 11 fields: 5-8 minutes (30-45 seconds each)
- Organize layout: 2 minutes
- **Total: ~10 minutes**

---

## 🚀 What's Next

After configuration:
1. Create your first post to test everything
2. Invite team members (Settings > Users)
3. Set up permissions (Settings > Roles)
4. Configure image uploads for featured images
5. Customize more as needed

---

**Done?** Go create some posts! 🎉

For detailed explanations, see [`DIRECTUS-FIELD-CONFIG.md`](./DIRECTUS-FIELD-CONFIG.md)
