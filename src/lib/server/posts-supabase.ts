/**
 * Supabase-based post loading
 * This file replaces the file-based posts.ts when using CMS
 */
import { supabase, db } from '$lib/supabase';
import type { Post } from '$lib/types';
import { sortPostsByDate } from '$lib/utils';

/**
 * Helper function to convert single-element JSONB arrays to strings
 * Database stores: ["longform"], ["documentary"], ["'25"]
 * App expects: "longform", "documentary", "'25"
 * @param arr - JSONB array from database
 * @returns First element as string, or empty string if array is empty/null
 */
function arrayToString(arr: string[] | null | undefined): string {
	return arr && arr.length > 0 ? arr[0] : '';
}

/**
 * Helper function to convert string to single-element array for database
 * App provides: "longform", "documentary", "'25"
 * Database expects: ["longform"], ["documentary"], ["'25"]
 * @param value - String value from app
 * @returns Single-element array for database
 */
function stringToArray(value: string): string[] {
	return [value];
}

/**
 * Get all published posts from Supabase
 * Posts are sorted by date in descending order (newest first)
 * @returns Array of published posts
 */
export async function getPosts(): Promise<Post[]> {
	const { data, error } = await db
		.posts()
		.select('*')
		.eq('published', true)
		.order('date', { ascending: false });

	if (error) {
		console.error('Error fetching posts:', error);
		return [];
	}

	// Map database rows to Post type
	// Convert JSONB arrays to strings for single-value fields
	return (data || []).map((row: any) => ({
		id: row.id,
		slug: row.slug,
		title: row.title,
		subtitle: row.subtitle || '',
		form: arrayToString(row.form), // ["longform"] → "longform"
		category: arrayToString(row.category), // ["documentary"] → "documentary"
		date: row.date,
		tags: row.tags || [], // Keep as array
		chapter: arrayToString(row.chapter), // ["'25"] → "'25"
		excerpt: row.excerpt,
		content: row.content,
		published: row.published,
		featuredImage: row.featured_image || undefined
	}));
}

/**
 * Get all posts including drafts
 * Useful for admin/preview functionality
 * @returns Array of all posts (published and unpublished)
 */
export async function getAllPosts(): Promise<Post[]> {
	const { data, error } = await db.posts().select('*').order('date', { ascending: false });

	if (error) {
		console.error('Error fetching all posts:', error);
		return [];
	}

	return (data || []).map((row: any) => ({
		id: row.id,
		slug: row.slug,
		title: row.title,
		subtitle: row.subtitle || '',
		form: arrayToString(row.form), // ["longform"] → "longform"
		category: arrayToString(row.category), // ["documentary"] → "documentary"
		date: row.date,
		tags: row.tags || [], // Keep as array
		chapter: arrayToString(row.chapter), // ["'25"] → "'25"
		excerpt: row.excerpt,
		content: row.content,
		published: row.published,
		featuredImage: row.featured_image || undefined
	}));
}

/**
 * Get a single post by its slug
 * @param slug - The post slug to find
 * @returns The post if found, null otherwise
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
	const { data, error } = await db.posts().select('*').eq('slug', slug).single();

	if (error || !data) {
		console.error('Error fetching post:', error);
		return null;
	}

	const row: any = data;
	return {
		id: row.id,
		slug: row.slug,
		title: row.title,
		subtitle: row.subtitle || '',
		form: arrayToString(row.form), // ["longform"] → "longform"
		category: arrayToString(row.category), // ["documentary"] → "documentary"
		date: row.date,
		tags: row.tags || [], // Keep as array
		chapter: arrayToString(row.chapter), // ["'25"] → "'25"
		excerpt: row.excerpt,
		content: row.content,
		published: row.published,
		featuredImage: row.featured_image || undefined
	};
}

/**
 * Get navigation posts (previous and next) for a given post
 * @param slug - The current post slug
 * @returns Object containing previousPost and nextPost (circular navigation)
 */
export async function getNavigationPosts(slug: string): Promise<{
	previousPost: Post | null;
	nextPost: Post | null;
}> {
	const posts = await getPosts();
	const currentIndex = posts.findIndex((p) => p.slug === slug);

	if (currentIndex === -1) {
		return { previousPost: null, nextPost: null };
	}

	const total = posts.length;

	return {
		previousPost: posts[(currentIndex + 1) % total] ?? null,
		nextPost: posts[(currentIndex - 1 + total) % total] ?? null
	};
}

/**
 * Get site configuration
 * @param key - Config key to retrieve
 * @returns Configuration value
 */
export async function getSiteConfig<T = unknown>(key: string): Promise<T | null> {
	const { data, error } = await db.siteConfig().select('value').eq('key', key).single();

	if (error || !data) {
		console.error('Error fetching site config:', error);
		return null;
	}

	const row: any = data;
	return row.value as T;
}

/**
 * Get pond configuration
 * @returns Pond configuration object
 */
export async function getPondConfig() {
	return await getSiteConfig<{
		title: string;
		subtitle: string;
		description: string;
		author: string;
		email: string;
		url: string;
	}>('pond_config');
}
