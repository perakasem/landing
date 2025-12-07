/**
 * Directus Webhook Handler: Replace Asset URLs
 *
 * This script can be deployed as a serverless function to handle
 * Directus webhooks and replace asset URLs with proper R2 URLs.
 *
 * Deploy to: Vercel/Netlify/Cloudflare Workers
 *
 * Directus Webhook Configuration:
 * - Method: POST
 * - URL: https://your-site.com/api/replace-asset-urls
 * - Collections: posts
 * - Actions: create, update
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/lib/types/database';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface WebhookPayload {
	event: string;
	accountability: any;
	payload: {
		slug: string;
		content: string;
	};
	key: string;
	collection: string;
}

export async function replaceAssetUrls(content: string): Promise<string> {
	if (!content || !content.includes('cms.perakasem.com/assets/')) {
		return content;
	}

	// Find all Directus asset URLs
	const urlPattern = /https?:\/\/cms\.perakasem\.com\/assets\/([a-f0-9-]+)/g;
	const matches = [...content.matchAll(urlPattern)];

	if (matches.length === 0) {
		return content;
	}

	// Get unique UUIDs
	const uuids = [...new Set(matches.map((m) => m[1]))];

	// Query Supabase for file information
	const { data: files, error } = await supabase
		.from('directus_files')
		.select('id, filename_disk')
		.in('id', uuids);

	if (error || !files) {
		console.error('Error fetching files:', error);
		return content;
	}

	// Create UUID -> filename map
	const fileMap: Record<string, string> = {};
	files.forEach((file) => {
		fileMap[file.id] = file.filename_disk;
	});

	// Replace URLs
	let updatedContent = content;
	matches.forEach((match) => {
		const uuid = match[1];
		const oldUrl = match[0];

		if (fileMap[uuid]) {
			const newUrl = `https://assets.perakasem.com/${fileMap[uuid]}`;
			updatedContent = updatedContent.replace(oldUrl, newUrl);
		}
	});

	return updatedContent;
}

// Example usage in a SvelteKit endpoint
export async function POST({ request }: { request: Request }) {
	try {
		const webhook: WebhookPayload = await request.json();

		// Only process posts collection
		if (webhook.collection !== 'posts') {
			return new Response('Not a post', { status: 200 });
		}

		const { slug, content } = webhook.payload;

		// Replace URLs
		const updatedContent = await replaceAssetUrls(content);

		// If content changed, update the post
		if (updatedContent !== content) {
			const { error } = await supabase
				.from('posts')
				.update({ content: updatedContent })
				.eq('slug', slug);

			if (error) {
				console.error('Error updating post:', error);
				return new Response('Error updating post', { status: 500 });
			}

			console.log(`Updated post: ${slug}`);
		}

		return new Response('OK', { status: 200 });
	} catch (error) {
		console.error('Webhook error:', error);
		return new Response('Error', { status: 500 });
	}
}
