-- Configure Directus Field Interfaces for Posts Collection (CORRECTED)
-- Uses only interfaces that actually exist in Directus

-- ============================================================================
-- STEP 1: Clear existing field configurations
-- ============================================================================

DELETE FROM directus_fields WHERE collection = 'posts';

-- ============================================================================
-- STEP 2: Insert properly configured fields with VALID interfaces
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

-- Field: slug (text input with monospace font)
INSERT INTO directus_fields (collection, field, interface, options, required, sort)
VALUES ('posts', 'slug', 'input', '{"placeholder": "post-slug", "trim": true, "font": "monospace"}', true, 4);

-- Field: form (text input with placeholder guidance) ⭐
-- Note: Directus doesn't support dropdown for TEXT fields via UI
-- Use input with clear placeholder instead
INSERT INTO directus_fields (collection, field, interface, options, required, sort)
VALUES ('posts', 'form', 'input',
    '{"placeholder": "longform or shortform", "trim": true, "iconRight": "category"}',
    true, 5);

-- Field: category (text input with placeholder) ⭐
INSERT INTO directus_fields (collection, field, interface, options, required, sort)
VALUES ('posts', 'category', 'input',
    '{"placeholder": "documentary, fiction, essay, reflection, review", "trim": true, "iconRight": "label"}',
    true, 6);

-- Field: chapter (text input with monospace font)
INSERT INTO directus_fields (collection, field, interface, options, required, sort)
VALUES ('posts', 'chapter', 'input', '{"placeholder": "''25, ''24, etc.", "trim": true, "font": "monospace"}', true, 7);

-- Field: date (datetime picker)
INSERT INTO directus_fields (collection, field, interface, display, required, sort)
VALUES ('posts', 'date', 'datetime', 'datetime', true, 8);

-- Field: tags (tags interface for JSONB) ⭐
INSERT INTO directus_fields (collection, field, interface, display, options, required, sort)
VALUES ('posts', 'tags', 'tags', 'tags',
    '{"placeholder": "Add tags...", "alphabetize": true, "allowCustom": true, "whitespace": "trim", "capitalization": "lowercase"}',
    true, 9);

-- Field: excerpt (rich text markdown)
INSERT INTO directus_fields (collection, field, interface, options, required, sort)
VALUES ('posts', 'excerpt', 'input-rich-text-md', '{"placeholder": "Brief summary (1-2 sentences)", "trim": true}', true, 10);

-- Field: content (code editor with markdown)
INSERT INTO directus_fields (collection, field, interface, options, required, sort)
VALUES ('posts', 'content', 'input-code',
    '{"language": "markdown", "lineNumber": true, "lineWrapping": true}',
    true, 11);

-- Field: published (boolean toggle)
INSERT INTO directus_fields (collection, field, interface, display, options, sort)
VALUES ('posts', 'published', 'boolean', 'boolean',
    '{"label": "Published", "iconOn": "visibility", "iconOff": "visibility_off"}',
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
-- VERIFICATION
-- ============================================================================

SELECT
    field,
    interface,
    special,
    required,
    sort
FROM directus_fields
WHERE collection = 'posts'
ORDER BY sort;

-- ============================================================================
-- NOTES & NEXT STEPS
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Directus field configurations inserted with VALID interfaces';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Fields configured:';
    RAISE NOTICE '   - form: Input (use placeholder for guidance)';
    RAISE NOTICE '   - category: Input (use placeholder for guidance)';
    RAISE NOTICE '   - chapter: Input (monospace)';
    RAISE NOTICE '   - tags: Tags interface (chips)';
    RAISE NOTICE '   - content: Code editor (markdown)';
    RAISE NOTICE '   - published: Boolean toggle';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  Limitation: Directus does not support dropdown for TEXT fields';
    RAISE NOTICE '   Alternatives:';
    RAISE NOTICE '   1. Use Input with clear placeholder (current approach)';
    RAISE NOTICE '   2. Create related collections (categories, forms) with M2O relationship';
    RAISE NOTICE '   3. Add client-side validation in Directus';
    RAISE NOTICE '';
    RAISE NOTICE '🔄 Next steps:';
    RAISE NOTICE '   1. Restart Directus: docker compose restart';
    RAISE NOTICE '   2. Login and verify fields are working';
    RAISE NOTICE '   3. See DIRECTUS-STUCK-INTERFACES-FIX.md for dropdown alternatives';
END $$;
