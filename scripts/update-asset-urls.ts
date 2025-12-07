/**
 * Update Asset URLs in Posts
 *
 * Changes asset URLs from Directus proxy to Cloudflare R2 custom domain
 * From: cms.perakasem.com/assets/UUID
 * To: assets.perakasem.com/UUID
 *
 * Usage:
 *   npx ts-node scripts/update-asset-urls.ts
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/lib/types/database';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
	console.error('❌ Missing required environment variables:');
	console.error('   - PUBLIC_SUPABASE_URL');
	console.error('   - SUPABASE_SERVICE_ROLE_KEY');
	process.exit(1);
}

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Configuration
const OLD_URL_PATTERN = 'cms.perakasem.com/assets/';
const NEW_URL_PATTERN = 'assets.perakasem.com/';

async function updateAssetUrls() {
	console.log('🔍 Finding posts with old asset URLs...\n');

	// Fetch all posts
	const { data: posts, error } = await supabase.from('posts').select('slug, title, content');

	if (error) {
		console.error('❌ Error fetching posts:', error);
		return;
	}

	if (!posts || posts.length === 0) {
		console.log('✅ No posts found.');
		return;
	}

	const postsToUpdate: Array<{ slug: string; title: string; newContent: string }> = [];

	// Find posts that need updating
	posts.forEach((post) => {
		if (post.content.includes(OLD_URL_PATTERN)) {
			const newContent = post.content.replaceAll(OLD_URL_PATTERN, NEW_URL_PATTERN);
			postsToUpdate.push({
				slug: post.slug,
				title: post.title,
				newContent
			});
		}
	});

	if (postsToUpdate.length === 0) {
		console.log('✅ No posts need updating. All asset URLs are already correct!\n');
		return;
	}

	console.log(`📝 Found ${postsToUpdate.length} post(s) with old asset URLs:\n`);
	postsToUpdate.forEach((post) => {
		console.log(`   - ${post.title} (${post.slug})`);
	});

	console.log('\n⚠️  This will update the content field in the database.');
	console.log('    Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

	// Wait 5 seconds before proceeding
	await new Promise((resolve) => setTimeout(resolve, 5000));

	console.log('🚀 Updating posts...\n');

	// Update each post
	for (const post of postsToUpdate) {
		const { error: updateError } = await supabase
			.from('posts')
			.update({ content: post.newContent })
			.eq('slug', post.slug);

		if (updateError) {
			console.error(`❌ Error updating ${post.slug}:`, updateError);
		} else {
			console.log(`✅ Updated: ${post.title}`);
		}
	}

	console.log('\n━'.repeat(50));
	console.log(`✅ Successfully updated ${postsToUpdate.length} post(s)!\n`);
	console.log('💡 Tip: Check your posts on the website to verify the images load correctly.\n');
}

async function previewChanges() {
	console.log('🔍 Preview Mode: Showing what would be changed\n');
	console.log('━'.repeat(50) + '\n');

	const { data: posts, error } = await supabase.from('posts').select('slug, title, content');

	if (error) {
		console.error('❌ Error fetching posts:', error);
		return;
	}

	if (!posts || posts.length === 0) {
		console.log('✅ No posts found.');
		return;
	}

	let foundChanges = false;

	posts.forEach((post) => {
		if (post.content.includes(OLD_URL_PATTERN)) {
			foundChanges = true;
			console.log(`📄 Post: ${post.title} (${post.slug})\n`);

			// Find all image URLs
			const imageMatches = [
				...post.content.matchAll(/!\[.*?\]\((https?:\/\/[^)]+)\)/g)
			];

			imageMatches.forEach((match) => {
				const url = match[1];
				if (url.includes(OLD_URL_PATTERN)) {
					const newUrl = url.replace(OLD_URL_PATTERN, NEW_URL_PATTERN);
					console.log(`   OLD: ${url}`);
					console.log(`   NEW: ${newUrl}\n`);
				}
			});
		}
	});

	if (!foundChanges) {
		console.log('✅ No posts need updating!\n');
	}

	console.log('━'.repeat(50));
	console.log('\n💡 To apply these changes, run without --preview flag\n');
}

async function main() {
	const args = process.argv.slice(2);
	const isPreview = args.includes('--preview') || args.includes('-p');

	console.log('🔧 Asset URL Update Tool\n');
	console.log('━'.repeat(50) + '\n');

	if (isPreview) {
		await previewChanges();
	} else {
		await updateAssetUrls();
	}
}

main();
