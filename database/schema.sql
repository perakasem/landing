-- =====================================================
-- DATABASE SCHEMA FOR PERAKASEM.COM
-- =====================================================
--
-- This file contains the complete database schema for the
-- SvelteKit + Directus + Supabase blog/portfolio site.
--
-- Tables:
-- 1. posts - Blog post content
-- 2. site_config - Site-wide configuration (singleton)
--
-- Usage:
--   Run this in Supabase SQL Editor to create all tables
--   and set up RLS policies.
--
-- =====================================================

-- =====================================================
-- 1. POSTS TABLE
-- =====================================================
-- Blog post content managed via Directus CMS

CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,

    -- JSONB arrays for Directus Tags interface
    -- These store single-element arrays: ["longform"], ["documentary"], ["'25"]
    -- The app converts them to strings using arrayToString()
    form JSONB NOT NULL DEFAULT '["longform"]'::jsonb,
    category JSONB NOT NULL DEFAULT '["documentary"]'::jsonb,
    chapter JSONB NOT NULL DEFAULT '["''25"]'::jsonb,

    -- Tags can have multiple elements
    tags JSONB DEFAULT '[]'::jsonb,

    date DATE NOT NULL DEFAULT CURRENT_DATE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    published BOOLEAN DEFAULT false,
    featured_image TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_posts_chapter ON posts USING GIN (chapter);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts USING GIN (category);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN (tags);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_posts_updated_at();

-- Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published posts
CREATE POLICY "Allow public read access to published posts"
    ON posts
    FOR SELECT
    TO public
    USING (published = true);

-- Allow authenticated users full access (for Directus)
CREATE POLICY "Allow authenticated users full access to posts"
    ON posts
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

COMMENT ON TABLE posts IS 'Blog posts managed via Directus CMS';
COMMENT ON COLUMN posts.form IS 'JSONB array: ["longform"] or ["shortform"]';
COMMENT ON COLUMN posts.category IS 'JSONB array: ["documentary"], ["fiction"], etc.';
COMMENT ON COLUMN posts.chapter IS 'JSONB array: ["''24"], ["''25"], etc.';
COMMENT ON COLUMN posts.tags IS 'JSONB array of tags: ["tag1", "tag2", ...]';

-- =====================================================
-- 2. SITE_CONFIG TABLE (Singleton)
-- =====================================================
-- Site-wide configuration managed via Directus CMS
-- This replaces hardcoded values with CMS-editable content

CREATE TABLE IF NOT EXISTS site_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Site Metadata
    title TEXT NOT NULL DEFAULT '3rd Space',
    description TEXT NOT NULL DEFAULT 'A bootleg substack of thoughts and things worth sharing.',
    current_chapter TEXT NOT NULL DEFAULT '''25',
    base_url TEXT NOT NULL DEFAULT 'https://perakasem.com/pond',

    -- Watch Section (Featured Video)
    watch_url TEXT,
    watch_title TEXT,
    watch_source TEXT,

    -- Media Section (Featured Music/Audio)
    media_url TEXT,
    media_title TEXT,
    media_source TEXT,

    -- Read Section (Featured Reading)
    read_url TEXT,
    read_title TEXT,
    read_source TEXT,

    -- Artwork Section
    artwork_src TEXT DEFAULT '/blank.jpg',
    artwork_title TEXT,
    artwork_artist TEXT,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default configuration (single row - singleton pattern)
INSERT INTO site_config (
    id,
    title,
    description,
    current_chapter,
    base_url,
    watch_url,
    watch_title,
    watch_source,
    media_url,
    media_title,
    media_source,
    read_url,
    read_title,
    read_source,
    artwork_src,
    artwork_title,
    artwork_artist
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- Fixed UUID for singleton
    '3rd Space',
    'A bootleg substack of thoughts and things worth sharing.',
    '''25',
    'https://perakasem.com/pond',
    'https://youtu.be/Q0_W4SWHeWY?si=02AWC2EJLwpe1Owx',
    'The Future of Creativity',
    'Hank Green',
    'https://youtu.be/E8pHAQc4rxA?si=L_0o_9hUGHUmTZut',
    'MF DOOM X Tatsuro Yamashita',
    'Tanda',
    'https://situational-awareness.ai/',
    'Situational Awareness',
    'Leopold Aschenbrenner',
    '/blank.jpg',
    'Tomato Water',
    'OC'
) ON CONFLICT (id) DO NOTHING;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_site_config_updated_at ON site_config(updated_at DESC);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_site_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_config_updated_at
    BEFORE UPDATE ON site_config
    FOR EACH ROW
    EXECUTE FUNCTION update_site_config_updated_at();

-- Row Level Security
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Allow public read access (site config is public)
CREATE POLICY "Allow public read access to site config"
    ON site_config
    FOR SELECT
    TO public
    USING (true);

-- Allow authenticated users to update (for Directus)
CREATE POLICY "Allow authenticated users to update site config"
    ON site_config
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

COMMENT ON TABLE site_config IS 'Singleton table for site-wide configuration (editable via Directus CMS)';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify tables were created correctly

-- Check posts table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'posts'
ORDER BY ordinal_position;

-- Check site_config table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'site_config'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT schemaname, tablename, policyname, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('posts', 'site_config');
