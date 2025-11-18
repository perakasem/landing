/**
 * Supabase-based post loading
 * This file replaces the file-based posts.ts when using CMS
 */
import { supabase, db } from '$lib/supabase';
import type { Post } from '$lib/types';
import { sortPostsByDate } from '$lib/utils';

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
	return (data || []).map((row) => ({
		id: row.id,
		slug: row.slug,
		title: row.title,
		subtitle: row.subtitle || '',
		form: row.form,
		category: row.category,
		date: row.date,
		tags: row.tags,
		chapter: row.chapter,
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

	return (data || []).map((row) => ({
		id: row.id,
		slug: row.slug,
		title: row.title,
		subtitle: row.subtitle || '',
		form: row.form,
		category: row.category,
		date: row.date,
		tags: row.tags,
		chapter: row.chapter,
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

	return {
		id: data.id,
		slug: data.slug,
		title: data.title,
		subtitle: data.subtitle || '',
		form: data.form,
		category: data.category,
		date: data.date,
		tags: data.tags,
		chapter: data.chapter,
		excerpt: data.excerpt,
		content: data.content,
		published: data.published,
		featuredImage: data.featured_image || undefined
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

	return data.value as T;
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
