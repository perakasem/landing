/**
 * Update Asset URLs in Posts
 *
 * Changes asset URLs from Directus proxy to Cloudflare R2 custom domain
 * From: https://cms.perakasem.com/assets/UUID
 * To: https://assets.perakasem.com/UUID.ext
 *
 * Usage:
 *   npx ts-node scripts/update-asset-urls.ts [--preview]
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

// Pattern to match Directus asset URLs
const DIRECTUS_URL_PATTERN = /https?:\/\/cms\.perakasem\.com\/assets\/([a-f0-9-]+)/g;

interface FileInfo {
	id: string;
	filename_disk: string;
}

async function getFileMap(uuids: string[]): Promise<Record<string, string>> {
	const { data: files, error } = await supabase
		.from('directus_files')
		.select('id, filename_disk')
		.in('id', uuids);

	if (error) {
		console.error('❌ Error fetching files:', error);
		return {};
	}

	const fileMap: Record<string, string> = {};
	files?.forEach((file: any) => {
		fileMap[file.id] = file.filename_disk;
	});

	return fileMap;
}

function replaceUrls(content: string, fileMap: Record<string, string>): string {
	return content.replace(DIRECTUS_URL_PATTERN, (match, uuid) => {
		if (fileMap[uuid]) {
			// New format: https://assets.perakasem.com/UUID.ext
			return `https://assets.perakasem.com/${fileMap[uuid]}`;
		}
		// If no match found, keep original (shouldn't happen)
		return match;
	});
}

async function updateAssetUrls() {
	console.log('🔍 Finding posts with old asset URLs...\n');

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

	// Find all posts with Directus URLs and extract UUIDs
	for (const post of posts) {
		if (!post.content.includes('cms.perakasem.com/assets/')) {
			continue;
		}

		// Extract all UUIDs from this post
		const matches = [...post.content.matchAll(DIRECTUS_URL_PATTERN)];
		const uuids = matches.map((m) => m[1]);

		if (uuids.length === 0) {
			continue;
		}

		// Get file information
		const fileMap = await getFileMap(uuids);

		// Replace URLs
		const newContent = replaceUrls(post.content, fileMap);

		if (newContent !== post.content) {
			postsToUpdate.push({
				slug: post.slug,
				title: post.title,
				newContent
			});
		}
	}

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

	await new Promise((resolve) => setTimeout(resolve, 5000));

	console.log('🚀 Updating posts...\n');

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

	for (const post of posts) {
		if (!post.content.includes('cms.perakasem.com/assets/')) {
			continue;
		}

		const matches = [...post.content.matchAll(DIRECTUS_URL_PATTERN)];
		if (matches.length === 0) {
			continue;
		}

		foundChanges = true;
		const uuids = matches.map((m) => m[1]);
		const fileMap = await getFileMap(uuids);

		console.log(`📄 Post: ${post.title} (${post.slug})\n`);

		matches.forEach((match) => {
			const uuid = match[1];
			const oldUrl = match[0];
			if (fileMap[uuid]) {
				const newUrl = `https://assets.perakasem.com/${fileMap[uuid]}`;
				console.log(`   OLD: ${oldUrl}`);
				console.log(`   NEW: ${newUrl}\n`);
			}
		});
	}

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
