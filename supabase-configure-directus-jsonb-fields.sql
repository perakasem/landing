-- Configure Directus Field Interfaces for JSONB Fields
-- Run this AFTER converting TEXT fields to JSONB

-- ============================================================================
-- STEP 1: Clear existing field configurations
-- ============================================================================

DELETE FROM directus_fields WHERE collection = 'posts';

-- ============================================================================
-- STEP 2: Insert field configurations with Tags interface
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

-- Field: slug (text input with monospace)
INSERT INTO directus_fields (collection, field, interface, options, required, sort)
VALUES ('posts', 'slug', 'input', '{"placeholder": "post-slug", "trim": true, "font": "monospace"}', true, 4);

-- Field: form (JSONB with Tags interface - chip selection!) ⭐
INSERT INTO directus_fields (collection, field, interface, display, options, required, sort)
VALUES ('posts', 'form', 'tags', 'labels',
    '{
        "placeholder": "Select form type",
        "alphabetize": false,
        "allowCustom": false,
        "whitespace": "trim",
        "capitalization": "lowercase",
        "iconRight": "category",
        "presetChoices": [
            {"text": "Long Form", "value": "longform"},
            {"text": "Short Form", "value": "shortform"}
        ]
    }'::jsonb,
    true, 5);

-- Field: category (JSONB with Tags interface - chip selection!) ⭐
INSERT INTO directus_fields (collection, field, interface, display, options, required, sort)
VALUES ('posts', 'category', 'tags', 'labels',
    '{
        "placeholder": "Select category",
        "alphabetize": true,
        "allowCustom": true,
        "whitespace": "trim",
        "capitalization": "lowercase",
        "iconRight": "label",
        "presetChoices": [
            {"text": "Documentary", "value": "documentary"},
            {"text": "Fiction", "value": "fiction"},
            {"text": "Essay", "value": "essay"},
            {"text": "Reflection", "value": "reflection"},
            {"text": "Review", "value": "review"}
        ]
    }'::jsonb,
    true, 6);

-- Field: chapter (JSONB with Tags interface) ⭐
INSERT INTO directus_fields (collection, field, interface, display, options, required, sort)
VALUES ('posts', 'chapter', 'tags', 'labels',
    '{
        "placeholder": "Enter chapter (e.g. ''25)",
        "alphabetize": false,
        "allowCustom": true,
        "whitespace": "trim",
        "iconRight": "calendar_today",
        "presetChoices": [
            {"text": "2025", "value": "''25"},
            {"text": "2024", "value": "''24"},
            {"text": "2023", "value": "''23"}
        ]
    }'::jsonb,
    true, 7);

-- Field: date (datetime picker)
INSERT INTO directus_fields (collection, field, interface, display, required, sort)
VALUES ('posts', 'date', 'datetime', 'datetime', true, 8);

-- Field: tags (JSONB with Tags interface - multi-select) ⭐
INSERT INTO directus_fields (collection, field, interface, display, options, required, sort)
VALUES ('posts', 'tags', 'tags', 'tags',
    '{
        "placeholder": "Add tags...",
        "alphabetize": true,
        "allowCustom": true,
        "whitespace": "trim",
        "capitalization": "lowercase",
        "iconRight": "local_offer"
    }'::jsonb,
    true, 9);

-- Field: excerpt (rich text markdown)
INSERT INTO directus_fields (collection, field, interface, options, required, sort)
VALUES ('posts', 'excerpt', 'input-rich-text-md',
    '{"placeholder": "Brief summary (1-2 sentences)", "trim": true}', true, 10);

-- Field: content (code editor with markdown)
INSERT INTO directus_fields (collection, field, interface, options, required, sort)
VALUES ('posts', 'content', 'input-code',
    '{
        "language": "markdown",
        "lineNumber": true,
        "lineWrapping": true
    }'::jsonb,
    true, 11);

-- Field: published (boolean toggle)
INSERT INTO directus_fields (collection, field, interface, display, options, sort)
VALUES ('posts', 'published', 'boolean', 'boolean',
    '{
        "label": "Published",
        "iconOn": "visibility",
        "iconOff": "visibility_off"
    }'::jsonb,
    12);

-- Field: featured_image (file input)
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
    display,
    required,
    sort
FROM directus_fields
WHERE collection = 'posts'
ORDER BY sort;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Directus field configurations set for JSONB fields';
    RAISE NOTICE '';
    RAISE NOTICE '🎨 Configured interfaces:';
    RAISE NOTICE '   - form: Tags (chips with 2 preset choices)';
    RAISE NOTICE '   - category: Tags (chips with 5 presets + custom allowed)';
    RAISE NOTICE '   - chapter: Tags (chips with year presets + custom allowed)';
    RAISE NOTICE '   - tags: Tags (multi-select chips)';
    RAISE NOTICE '   - content: Code editor (markdown)';
    RAISE NOTICE '   - published: Boolean toggle';
    RAISE NOTICE '';
    RAISE NOTICE '✨ What you''ll see in Directus:';
    RAISE NOTICE '   form:     [Long Form ▼] or [Short Form ▼] (chip selection)';
    RAISE NOTICE '   category: [Documentary ▼] [Fiction ▼] ... (chip selection)';
    RAISE NOTICE '   chapter:  [''25 ▼] [''24 ▼] ... (chip selection + custom)';
    RAISE NOTICE '   tags:     [tag1] [tag2] [+ Add...] (multi-select chips)';
    RAISE NOTICE '';
    RAISE NOTICE '🔄 Next steps:';
    RAISE NOTICE '   1. Restart Directus: docker compose restart';
    RAISE NOTICE '   2. Clear cache: docker compose exec directus npx directus cache clear';
    RAISE NOTICE '   3. Login and test!';
END $$;
