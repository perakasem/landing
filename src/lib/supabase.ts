import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
import type { Database } from './types/database';

/**
 * Get Supabase environment variables with fallback for type checking
 */
const supabaseUrl = env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

/**
 * Supabase client for browser and server
 * Uses public credentials - RLS policies control access
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
	auth: {
		persistSession: false // Server-side, don't persist
	}
});

/**
 * Type-safe database helpers
 */
export const db = {
	posts: () => supabase.from('posts'),
	siteConfig: () => supabase.from('site_config'),
};
