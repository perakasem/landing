/**
 * Server-side configuration loader
 * Fetches site configuration from Supabase database
 * Falls back to hardcoded defaults if database is unavailable
 */

import { db } from '$lib/supabase';
import { dev } from '$app/environment';

// Default fallback configuration
const DEFAULT_CONFIG = {
	title: '3rd Space',
	description: 'A bootleg substack of thoughts and things worth sharing.',
	currentChapter: "'25",
	url: 'https://perakasem.com/pond',
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
		console.log('[CONFIG] Fetching site config from database...');
		const { data, error } = await db.siteConfig().select('*').limit(1).single();

		if (error) {
			console.error('[CONFIG] Failed to fetch site config from database:', error);
			console.log('[CONFIG] Using default config');
			return DEFAULT_CONFIG;
		}

		if (!data) {
			console.warn('[CONFIG] No site config found in database, using defaults');
			return DEFAULT_CONFIG;
		}

		const row: any = data;
		console.log('[CONFIG] Successfully loaded config from database:', {
			title: row.title,
			hasData: !!row
		});

		// Map database fields to config interface
		return {
			title: row.title,
			description: row.description,
			currentChapter: row.current_chapter,
			url: row.base_url,
			watchUrl: row.watch_url,
			watch: row.watch_title,
			watchSource: row.watch_source,
			mediaUrl: row.media_url,
			media: row.media_title,
			mediaSource: row.media_source,
			readUrl: row.read_url,
			read: row.read_title,
			readSource: row.read_source,
			artworkSrc: row.artwork_src,
			artwork: row.artwork_title,
			artist: row.artwork_artist
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
	const cacheAge = cachedConfig ? now - cacheTimestamp : 0;

	if (cachedConfig && cacheAge < CACHE_TTL) {
		console.log('[CONFIG] Using cached config (age:', Math.round(cacheAge / 1000), 'seconds)');
		return cachedConfig;
	}

	console.log('[CONFIG] Cache expired or empty, fetching fresh config');
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
