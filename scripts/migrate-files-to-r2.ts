/**
 * Migration Script: Local Files to Cloudflare R2
 *
 * This script helps migrate existing Directus files from local storage to R2.
 *
 * Prerequisites:
 * - R2 bucket configured in Directus
 * - STORAGE_CLOUDFLARE_* environment variables set
 * - Directus restarted with new configuration
 *
 * Usage:
 *   npx ts-node scripts/migrate-files-to-r2.ts
 *
 * What this does:
 * 1. Lists all files in directus_files table
 * 2. Identifies files still using 'local' storage
 * 3. Provides migration options
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/lib/types/database';

// Environment variables
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
	console.error('❌ Missing required environment variables:');
	console.error('   - PUBLIC_SUPABASE_URL');
	console.error('   - SUPABASE_SERVICE_ROLE_KEY');
	process.exit(1);
}

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface DirectusFile {
	id: string;
	filename_disk: string;
	filename_download: string;
	storage: string;
	type: string;
	uploaded_on: string;
}

async function listFiles() {
	console.log('📂 Fetching files from directus_files table...\n');

	const { data, error } = await supabase.from('directus_files').select('*');

	if (error) {
		console.error('❌ Error fetching files:', error);
		return;
	}

	if (!data || data.length === 0) {
		console.log('✅ No files found in directus_files table.');
		return;
	}

	const files = data as unknown as DirectusFile[];
	const localFiles = files.filter((f) => f.storage === 'local');
	const r2Files = files.filter((f) => f.storage === 'cloudflare');

	console.log('📊 File Storage Summary:\n');
	console.log(`   Total files: ${files.length}`);
	console.log(`   Local storage: ${localFiles.length}`);
	console.log(`   R2 storage: ${r2Files.length}\n`);

	if (localFiles.length > 0) {
		console.log('⚠️  Files still on local storage:\n');
		localFiles.forEach((file) => {
			console.log(`   - ${file.filename_download}`);
			console.log(`     ID: ${file.id}`);
			console.log(`     Disk: ${file.filename_disk}`);
			console.log(`     Type: ${file.type}`);
			console.log(`     Uploaded: ${new Date(file.uploaded_on).toLocaleString()}\n`);
		});

		console.log('🔧 Migration Options:\n');
		console.log('   Option 1: Manual re-upload via Directus admin');
		console.log('   Option 2: Download files and re-upload programmatically');
		console.log('   Option 3: Use Directus CLI tools (if available)\n');
		console.log('⚠️  Note: After migration, you may need to update references in posts.');
	} else {
		console.log('✅ All files migrated to R2!');
	}

	if (r2Files.length > 0) {
		console.log('\n📦 Files on R2:\n');
		r2Files.forEach((file) => {
			console.log(`   ✅ ${file.filename_download} (${file.id})`);
		});
	}
}

async function checkPostReferences() {
	console.log('\n🔍 Checking post references to files...\n');

	const { data: posts, error } = await supabase
		.from('posts')
		.select('slug, title, content')
		.eq('published', true);

	if (error) {
		console.error('❌ Error fetching posts:', error);
		return;
	}

	if (!posts || posts.length === 0) {
		console.log('✅ No posts found.');
		return;
	}

	// Pattern to find image references in markdown
	const imagePattern = /!\[.*?\]\((.*?)\)/g;

	posts.forEach((post) => {
		const images = [...post.content.matchAll(imagePattern)];
		if (images.length > 0) {
			console.log(`   Post: ${post.title} (${post.slug})`);
			images.forEach((match) => {
				console.log(`      - Image: ${match[1]}`);
			});
		}
	});

	console.log('\n💡 If images are broken after migration:');
	console.log('   1. Check Directus File Library for new file URLs');
	console.log('   2. Update markdown content with new URLs');
	console.log('   3. Or update via Directus admin UI\n');
}

async function main() {
	console.log('🚀 Directus File Migration Tool\n');
	console.log('━'.repeat(50) + '\n');

	try {
		await listFiles();
		await checkPostReferences();

		console.log('\n━'.repeat(50));
		console.log('✅ Migration check complete!\n');
	} catch (error) {
		console.error('❌ Error during migration check:', error);
		process.exit(1);
	}
}

main();
