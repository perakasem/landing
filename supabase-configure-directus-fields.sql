-- Configure Directus Field Interfaces for Posts Collection
-- This manually sets up the correct interfaces for each field

-- ============================================================================
-- STEP 1: Clear existing field configurations
-- ============================================================================

DELETE FROM directus_fields WHERE collection = 'posts';

-- ============================================================================
-- STEP 2: Insert properly configured fields
-- ============================================================================

-- Field: id (hidden system field)
INSERT INTO directus_fields (collection, field, interface, special, readonly, hidden, sort)
VALUES ('posts', 'id', 'input', 'uuid', true, true, 1);

-- Field: title (text input)
INSERT INTO directus_fields (collection, field, interface, options, required, sort)
VALUES ('posts', 'title', 'input', '{"placeholder": "Enter post title", "trim": true}', true, 2);

-- Field: subtitle (text input)
INSERT INTO directus_fields (collection, field, interface, options, sort)
VALUES ('posts', 'subtitle', 'input', '{"placeholder": "Enter subtitle (optional)", "trim": true}', 3);

-- Field: slug (text input with slug font)
INSERT INTO directus_fields (collection, field, interface, options, required, sort)
VALUES ('posts', 'slug', 'input', '{"placeholder": "post-slug", "trim": true, "font": "monospace"}', true, 4);

-- Field: form (DROPDOWN for TEXT field) ⭐
INSERT INTO directus_fields (collection, field, interface, display, options, required, sort)
VALUES ('posts', 'form', 'select-dropdown', 'labels',
    '{"choices": [
        {"text": "Long Form", "value": "longform"},
        {"text": "Short Form", "value": "shortform"}
    ], "allowNone": false, "allowOther": false, "icon": "category"}',
    true, 5);

-- Field: category (DROPDOWN for TEXT field) ⭐
INSERT INTO directus_fields (collection, field, interface, options, required, sort)
VALUES ('posts', 'category', 'select-dropdown',
    '{"choices": [
        {"text": "Documentary", "value": "documentary"},
        {"text": "Fiction", "value": "fiction"},
        {"text": "Essay", "value": "essay"},
        {"text": "Reflection", "value": "reflection"},
        {"text": "Review", "value": "review"}
    ], "allowNone": false, "allowOther": true, "icon": "label"}',
    true, 6);

-- Field: chapter (text input with monospace font)
INSERT INTO directus_fields (collection, field, interface, options, required, sort)
VALUES ('posts', 'chapter', 'input', '{"placeholder": "''25, ''24, etc.", "trim": true, "font": "monospace"}', true, 7);

-- Field: date (date picker)
INSERT INTO directus_fields (collection, field, interface, display, required, sort)
VALUES ('posts', 'date', 'datetime', 'datetime', true, 8);

-- Field: tags (tags interface for JSONB) ⭐
INSERT INTO directus_fields (collection, field, interface, display, options, required, sort)
VALUES ('posts', 'tags', 'tags', 'tags',
    '{"placeholder": "Add tags...", "alphabetize": true, "allowCustom": true, "whitespace": "trim", "capitalization": "lowercase"}',
    true, 9);

-- Field: excerpt (textarea)
INSERT INTO directus_fields (collection, field, interface, options, required, sort)
VALUES ('posts', 'excerpt', 'input-rich-text-md', '{"placeholder": "Brief summary (1-2 sentences)", "trim": true}', true, 10);

-- Field: content (markdown editor)
INSERT INTO directus_fields (collection, field, interface, options, required, sort)
VALUES ('posts', 'content', 'input-code',
    '{"language": "markdown", "lineNumber": true, "lineWrapping": true}',
    true, 11);

-- Field: published (toggle)
INSERT INTO directus_fields (collection, field, interface, display, options, sort)
VALUES ('posts', 'published', 'boolean', 'boolean',
    '{"label": "Published", "iconOn": "visibility", "iconOff": "visibility_off"}',
    12);

-- Field: featured_image (file/image)
INSERT INTO directus_fields (collection, field, interface, sort)
VALUES ('posts', 'featured_image', 'input', 13);

-- Field: created_at (datetime, readonly)
INSERT INTO directus_fields (collection, field, interface, display, readonly, hidden, special, sort)
VALUES ('posts', 'created_at', 'datetime', 'datetime', true, false, 'date-created', 14);

-- Field: updated_at (datetime, readonly)
INSERT INTO directus_fields (collection, field, interface, display, readonly, hidden, special, sort)
VALUES ('posts', 'updated_at', 'datetime', 'datetime', true, false, 'date-updated', 15);

-- ============================================================================
-- STEP 3: Configure collection settings
-- ============================================================================

-- Insert or update collection configuration
INSERT INTO directus_collections (collection, icon, display_template, note, sort_field)
VALUES ('posts', 'article', '{{title}}', 'Blog posts for the Pond section', 'date')
ON CONFLICT (collection) DO UPDATE SET
    icon = 'article',
    display_template = '{{title}}',
    note = 'Blog posts for the Pond section',
    sort_field = 'date';

-- ============================================================================
-- STEP 4: Verify configuration
-- ============================================================================

SELECT
    field,
    interface,
    special,
    required,
    readonly,
    hidden,
    sort
FROM directus_fields
WHERE collection = 'posts'
ORDER BY sort;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Directus field configurations inserted';
    RAISE NOTICE '✅ Fields configured:';
    RAISE NOTICE '   - form: Dropdown (longform/shortform)';
    RAISE NOTICE '   - category: Dropdown with custom values allowed';
    RAISE NOTICE '   - chapter: Text input (monospace)';
    RAISE NOTICE '   - tags: Tags interface';
    RAISE NOTICE '   - content: Markdown editor';
    RAISE NOTICE '   - published: Toggle';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  Next steps:';
    RAISE NOTICE '   1. Restart Directus: docker compose restart';
    RAISE NOTICE '   2. Wait 20 seconds';
    RAISE NOTICE '   3. Login to Directus';
    RAISE NOTICE '   4. All fields should now be properly configured!';
    RAISE NOTICE '   5. If interfaces still stuck, clear browser cache';
END $$;
