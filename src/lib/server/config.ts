/**
 * Server-side configuration loader
 * Fetches site configuration from Supabase database
 * Falls back to hardcoded defaults if database is unavailable
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';
import { dev } from '$app/environment';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Default fallback configuration
const DEFAULT_CONFIG = {
	title: '3rd Space',
	description: 'A bootleg substack of thoughts and things worth sharing.',
	currentChapter: "'25",
	url: dev ? 'http://localhost:5173/pond' : 'https://perakasem.co/pond',
	watchUrl: 'https://youtu.be/Q0_W4SWHeWY?si=02AWC2EJLwpe1Owx',
	watch: 'The Future of Creativity',
	watchSource: 'Hank Green',
	mediaUrl: 'https://youtu.be/E8pHAQc4rxA?si=L_0o_9hUGHUmTZut',
	media: 'MF DOOM X Tatsuro Yamashita',
	mediaSource: 'Tanda',
	readUrl: 'https://situational-awareness.ai/',
	read: 'Situational Awareness',
	readSource: 'Leopold Aschenbrenner',
	artworkSrc: '/blank.jpg',
	artwork: 'Tomato Water',
	artist: 'OC'
};

export interface SiteConfig {
	title: string;
	description: string;
	currentChapter: string;
	url: string;
	watchUrl: string | null;
	watch: string | null;
	watchSource: string | null;
	mediaUrl: string | null;
	media: string | null;
	mediaSource: string | null;
	readUrl: string | null;
	read: string | null;
	readSource: string | null;
	artworkSrc: string | null;
	artwork: string | null;
	artist: string | null;
}

/**
 * Fetches site configuration from database
 * Returns the first (and should be only) row from site_config table
 * Falls back to DEFAULT_CONFIG if fetch fails
 */
export async function getSiteConfig(): Promise<SiteConfig> {
	try {
		const { data, error } = await supabase
			.from('site_config')
			.select('*')
			.limit(1)
			.single();

		if (error) {
			console.warn('Failed to fetch site config from database, using defaults:', error.message);
			return DEFAULT_CONFIG;
		}

		if (!data) {
			console.warn('No site config found in database, using defaults');
			return DEFAULT_CONFIG;
		}

		// Map database fields to config interface
		return {
			title: data.title,
			description: data.description,
			currentChapter: data.current_chapter,
			url: dev ? 'http://localhost:5173/pond' : data.base_url,
			watchUrl: data.watch_url,
			watch: data.watch_title,
			watchSource: data.watch_source,
			mediaUrl: data.media_url,
			media: data.media_title,
			mediaSource: data.media_source,
			readUrl: data.read_url,
			read: data.read_title,
			readSource: data.read_source,
			artworkSrc: data.artwork_src,
			artwork: data.artwork_title,
			artist: data.artwork_artist
		};
	} catch (err) {
		console.error('Error fetching site config:', err);
		return DEFAULT_CONFIG;
	}
}

/**
 * Cached config - fetched once per request
 * For use in components/pages that need config multiple times
 */
let cachedConfig: SiteConfig | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getCachedSiteConfig(): Promise<SiteConfig> {
	const now = Date.now();

	if (cachedConfig && now - cacheTimestamp < CACHE_TTL) {
		return cachedConfig;
	}

	cachedConfig = await getSiteConfig();
	cacheTimestamp = now;
	return cachedConfig;
}

/**
 * Clear the config cache (useful after updates)
 */
export function clearConfigCache(): void {
	cachedConfig = null;
	cacheTimestamp = 0;
}
