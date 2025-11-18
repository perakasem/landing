# Directus Field Configuration Guide

Complete guide for configuring the Posts collection UI in Directus for optimal editing experience.

---

## Quick Setup: Import Configuration

### Option 1: Manual Configuration (Recommended - 5 minutes)

Follow the steps below to configure each field in Directus UI.

### Option 2: SQL Script (Advanced)

Run the SQL script in `directus-field-config.sql` to automatically configure all fields.

---

## Configuring the Posts Collection

After logging into Directus (http://localhost:8055), go to **Settings** > **Data Model** > **posts**

### Collection Settings

1. Click on **posts** collection
2. Set the following:
   - **Collection Name**: Posts
   - **Singleton**: No
   - **Icon**: `article` or `edit_note`
   - **Display Template**: `{{title}}`
   - **Note**: Leave empty or add description
   - **Hidden**: No
   - **Archive Field**: None (we use `published` as boolean)
   - **Sort Field**: `date` (descending)

---

## Field-by-Field Configuration

Click on each field to configure its interface and display options.

### 1. Title

**Interface**: Input (Text Input)
- Type: Text
- Placeholder: `Enter post title`
- Options:
  - ✅ Trim whitespace
  - Font: Default
  - Monospace: No
- Required: ✅ Yes
- Width: Full

**Display**: Raw Value

---

### 2. Subtitle

**Interface**: Input (Text Input)
- Type: Text
- Placeholder: `Enter subtitle (optional)`
- Options:
  - ✅ Trim whitespace
- Required: ❌ No
- Width: Full

**Display**: Raw Value

---

### 3. Slug

**Interface**: Input (Text Input with Slug Options)
- Type: Text
- Placeholder: `post-slug`
- Options:
  - ✅ Trim whitespace
  - ✅ Slug (auto-generate from title)
  - Font: Monospace
- Required: ✅ Yes
- Width: Half
- Note: "URL-friendly identifier (auto-generated from title)"

**Display**: Raw Value

**Validation**:
- Pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- Message: "Slug must be lowercase letters, numbers, and hyphens only"

---

### 4. Form

**Interface**: Dropdown (Select)
- Choices:
  - Value: `longform` | Text: `Long Form` | Icon: `article`
  - Value: `shortform` | Text: `Short Form` | Icon: `notes`
- Placeholder: `Select form type`
- Icon: `category`
- Required: ✅ Yes
- Width: Half

**Display**: Labels (Formatted Value)

---

### 5. Category

**Interface**: Input (Text Input)
- Type: Text
- Placeholder: `documentary, fiction, essay, etc.`
- Options:
  - ✅ Trim whitespace
  - ✅ Lowercase
- Required: ✅ Yes
- Width: Half

**Display**: Raw Value

**Alternative (if you want predefined categories)**:
- Interface: Dropdown
- Choices: `documentary`, `fiction`, `essay`, `reflection`, `review`

---

### 6. Chapter

**Interface**: Input (Text Input)
- Type: Text
- Placeholder: `'25, '24, etc.`
- Options:
  - ✅ Trim whitespace
  - Font: Monospace
- Required: ✅ Yes
- Width: Half

**Display**: Raw Value

---

### 7. Date

**Interface**: DateTime (Date Picker)
- Type: Date (not datetime)
- Include seconds: No
- Use 24-hour format: Yes
- Placeholder: `Select publish date`
- Required: ✅ Yes
- Width: Half

**Display**: Formatted Value
- Format: `YYYY-MM-DD` or `MMM D, YYYY`

---

### 8. Tags

**Interface**: Tags 🎯 (IMPORTANT!)
- Preset: Tags
- Placeholder: `Add tags...`
- Options:
  - Alphabetize: Yes
  - Allow custom values: Yes
  - Whitespace: Trim
  - Capitalization: Lowercase
  - Icon: `label`
- Required: ✅ Yes (at least one tag)
- Width: Full

**Display**: Tags (Badge style)
- Format: Badges with color

**Configuration**:
```json
{
  "preset": "tags",
  "alphabetize": true,
  "allowCustom": true,
  "whitespace": "trim",
  "capitalization": "lowercase",
  "iconRight": "local_offer"
}
```

---

### 9. Excerpt

**Interface**: Textarea (Text Area)
- Rows: 3-4
- Placeholder: `Brief summary for listings (1-2 sentences)`
- Options:
  - ✅ Trim whitespace
  - Monospace: No
- Required: ✅ Yes
- Width: Full

**Display**: Formatted Value

---

### 10. Content

**Interface**: Markdown (Input Rich Text WYSIWYG) 🎯 (IMPORTANT!)

**Option A: Markdown Editor (Recommended)**
- Interface: **Markdown** (if available in your Directus version)
- Toolbar options:
  - ✅ Bold, Italic, Strikethrough
  - ✅ Headers (H1-H4)
  - ✅ Lists (ordered, unordered)
  - ✅ Links
  - ✅ Images
  - ✅ Code blocks
  - ✅ Blockquotes
  - ✅ Preview toggle
- Required: ✅ Yes
- Width: Full
- Rows: 20+ (full height)

**Option B: WYSIWYG Editor (Alternative)**
- Interface: **Input Rich Text WYSIWYG**
- Toolbar: Full
- Required: ✅ Yes
- Width: Full

**Option C: Code Editor (If markdown preview not needed)**
- Interface: **Input Code**
- Language: Markdown
- Line numbers: Yes
- Line wrapping: Yes
- Template: None
- Required: ✅ Yes
- Width: Full

**Display**: Formatted Text (HTML)

**Configuration for Markdown**:
```json
{
  "toolbar": [
    "bold",
    "italic",
    "strikethrough",
    "heading",
    "code",
    "link",
    "bullist",
    "numlist",
    "blockquote",
    "image",
    "preview"
  ],
  "customSyntax": [],
  "imageToken": null,
  "softLength": null
}
```

---

### 11. Published

**Interface**: Toggle (Boolean)
- Label: Published
- Icon On: `visibility`
- Icon Off: `visibility_off`
- Color: Brand (Blue/Green)
- Label:
  - On: "Published"
  - Off: "Draft"
- Required: ✅ Yes
- Width: Half

**Display**: Boolean (Checkbox or Badge)

---

### 12. Featured Image (Optional)

**Interface**: Image (File)
- Folder: `posts/featured`
- Accepted file types: `image/*`
- Required: ❌ No
- Width: Half

**Display**: Image

---

### 13. ID (System Field)

**Interface**: Input (UUID)
- Readonly: ✅ Yes
- Hidden in forms: ✅ Yes
- Width: Half

**Display**: Raw Value

---

### 14. Created At / Updated At (System Fields)

**Interface**: DateTime
- Readonly: ✅ Yes
- Hidden in forms: Can show in "Advanced" section
- Width: Half

**Display**: Formatted Date
- Format: `MMM D, YYYY h:mm A`

---

## Collection Layout Configuration

### List View (Table)

Configure which columns show in the table view:

1. Go to **Posts** collection
2. Click the **layout icon** (grid) in top right
3. Select **Table** layout
4. Click **Configure Layout**
5. Enable these columns:
   - ✅ Title
   - ✅ Subtitle
   - ✅ Category
   - ✅ Date
   - ✅ Tags
   - ✅ Published (show as badge)
   - ✅ Form
   - ❌ Content (too large for table)
   - ❌ Excerpt (optional, can add)

6. Set column widths:
   - Title: 300px
   - Subtitle: 250px
   - Category: 120px
   - Date: 120px
   - Tags: 200px
   - Published: 100px

### Detail View (Form)

Organize fields into sections:

1. Go to **Settings** > **Data Model** > **posts**
2. Click **Fields & Layout**
3. Create sections:

**Section 1: Basic Information**
- Title (full width)
- Subtitle (full width)
- Slug (half width)
- Form (half width)

**Section 2: Classification**
- Category (half width)
- Chapter (half width)
- Date (half width)
- Published (half width)
- Tags (full width)

**Section 3: Content**
- Excerpt (full width)
- Content (full width)
- Featured Image (optional, half width)

**Section 4: Metadata (collapsed by default)**
- ID (half width)
- Created At (half width)
- Updated At (half width)

---

## Install Markdown Extension (Optional)

If Directus doesn't have a built-in Markdown editor, install an extension:

### Option 1: Directus Markdown Extension

```bash
# In your Directus directory
npm install directus-extension-markdown-interface
```

Then restart Directus:
```bash
docker compose restart
```

### Option 2: Use WYSIWYG + Markdown Export

1. Use the built-in WYSIWYG editor
2. Content is stored as HTML
3. Use a markdown converter if needed

---

## Testing Your Configuration

### Create a Test Post

1. Go to **Posts** collection
2. Click **Create Item** (+)
3. Verify:
   - Title: Large text input
   - Tags: Shows as tag chips with autocomplete
   - Content: Large editor with toolbar (markdown or WYSIWYG)
   - Date: Calendar picker
   - Published: Toggle switch
   - Form: Dropdown with icons

4. Try adding tags:
   - Type "documentary" and press Enter
   - Tag should appear as a colored chip
   - Should be able to remove by clicking X

5. Test content editor:
   - Should have toolbar for formatting
   - Should resize or scroll smoothly
   - Preview button (if markdown)

---

## Keyboard Shortcuts in Directus

While editing:
- **Cmd/Ctrl + S**: Save
- **Cmd/Ctrl + Enter**: Save and stay
- **Esc**: Close without saving
- **Tab**: Next field

In Markdown editor:
- **Cmd/Ctrl + B**: Bold
- **Cmd/Ctrl + I**: Italic
- **Cmd/Ctrl + K**: Link
- **Cmd/Ctrl + Shift + P**: Preview

---

## Troubleshooting

### Tags showing as text input instead of chips

**Fix**:
1. Go to field configuration
2. Change interface from "Input" to "Tags"
3. Set preset to "tags"
4. Save

### Content field too small / requires scrolling

**Fix**:
1. Go to field configuration
2. Change interface to "Markdown" or "Input Code"
3. Set minimum height or use full-height option
4. For Markdown: enable preview mode

### No markdown preview

**Fix**:
1. Install markdown extension: `directus-extension-markdown-interface`
2. Or use split-screen: Write in code editor, preview in separate tab
3. Or use WYSIWYG and save as HTML

### Fields not in the right order

**Fix**:
1. Go to Settings > Data Model > posts
2. Drag and drop fields to reorder
3. Create sections to group related fields

---

## Advanced: Import/Export Configuration

### Export Current Configuration

```bash
# From Directus
npx directus schema snapshot ./snapshot.yaml

# This creates a snapshot of your entire data model
```

### Import Configuration

```bash
# Import a snapshot
npx directus schema apply ./snapshot.yaml
```

---

## Summary: Optimal Field Configuration

| Field | Interface | Key Settings |
|-------|-----------|--------------|
| title | Input | Text, trim, required |
| subtitle | Input | Text, optional |
| slug | Input | Slug preset, monospace, pattern validation |
| form | Dropdown | longform/shortform choices |
| category | Input | Lowercase, trim |
| chapter | Input | Monospace |
| date | DateTime | Date only, YYYY-MM-DD |
| **tags** | **Tags** | **Alphabetize, lowercase, chips** |
| excerpt | Textarea | 3-4 rows |
| **content** | **Markdown / WYSIWYG** | **Full toolbar, preview, full height** |
| published | Toggle | Boolean, visual icons |

---

## Next Steps

1. [ ] Configure all fields as described above
2. [ ] Test creating a post with proper UI
3. [ ] Adjust layout sections for better organization
4. [ ] Set up permissions if working with a team
5. [ ] Configure image uploads for featured images
6. [ ] Set up webhooks for cache invalidation

---

**Need help?**
- Directus Field Interfaces: https://docs.directus.io/app/data-model/fields.html
- Directus Layouts: https://docs.directus.io/app/layouts.html
