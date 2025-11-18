import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from './types/database';

/**
 * Supabase client for browser and server
 * Uses public credentials - RLS policies control access
 */
export const supabase = createClient<Database>(
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY,
	{
		auth: {
			persistSession: false // Server-side, don't persist
		}
	}
);

/**
 * Type-safe database helpers
 */
export const db = {
	posts: () => supabase.from('posts'),
	siteConfig: () => supabase.from('site_config'),
	media: () => supabase.from('media'),
	contentPages: () => supabase.from('content_pages')
};
