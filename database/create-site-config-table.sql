-- Create site_config table for managing pond configuration via Directus
-- This replaces hardcoded values in pond.config.ts with CMS-editable content

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
    'https://perakasem.co/pond',
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

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_site_config_updated_at ON site_config(updated_at DESC);

-- Add trigger to auto-update updated_at timestamp
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

-- Grant permissions (adjust based on your RLS policies)
-- For now, allow authenticated users to read
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Allow public read access (since this is site config)
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
