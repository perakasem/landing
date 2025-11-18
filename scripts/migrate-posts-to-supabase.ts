/**
 * Migration Script: Markdown Posts to Supabase
 * Run this script to migrate existing markdown posts to Supabase database
 *
 * Prerequisites:
 *   - Supabase project set up with schema from supabase-schema.sql
 *   - Environment variables in .env file:
 *     - PUBLIC_SUPABASE_URL
 *     - SUPABASE_SERVICE_ROLE_KEY (required - bypasses RLS for admin operations)
 *
 * Usage:
 *   npx tsx scripts/migrate-posts-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';

// Configuration
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || 'https://mipgedcytuqbdmdppdzm.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pcGdlZGN5dHVxYmRtZHBwZHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MjgwMDQsImV4cCI6MjA3OTAwNDAwNH0.5mT-LN5DuwhLFh6_9elnhChGNJUBb7DiOWNg485ZwI4';
const POSTS_DIR = join(process.cwd(), 'src', 'posts');

// Create Supabase client with service role key (bypasses RLS for migrations)
// Service role key has full database access - use for administrative tasks only
const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
	console.warn('⚠️  Warning: SUPABASE_SERVICE_ROLE_KEY not found, using SUPABASE_ANON_KEY');
	console.warn('   This may fail due to Row Level Security policies.');
	console.warn('   Get your service role key from Supabase dashboard > Settings > API\n');
}

const supabase = createClient(SUPABASE_URL, supabaseKey);

interface MarkdownPost {
	frontmatter: {
		title: string;
		subtitle?: string;
		form: 'longform' | 'shortform';
		category: string;
		date: string;
		tags: string[];
		chapter: string;
		excerpt: string;
		published: boolean;
	};
	content: string;
	slug: string;
}

/**
 * Parse markdown file with YAML frontmatter
 */
function parseMarkdownFile(filePath: string, slug: string): MarkdownPost {
	const fileContent = readFileSync(filePath, 'utf-8');

	// Extract frontmatter and content
	const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

	if (!frontmatterMatch) {
		throw new Error(`Invalid markdown format in ${filePath}`);
	}

	const [, frontmatterYaml, content] = frontmatterMatch;
	const frontmatter = parse(frontmatterYaml);

	return {
		frontmatter: {
			title: frontmatter.title,
			subtitle: frontmatter.subtitle,
			form: frontmatter.form,
			category: frontmatter.category,
			date: frontmatter.date,
			tags: frontmatter.tags || [],
			chapter: frontmatter.chapter,
			excerpt: frontmatter.excerpt,
			published: frontmatter.published !== false // Default to true
		},
		content: content.trim(),
		slug
	};
}

/**
 * Main migration function
 */
async function migratePosts() {
	console.log('🚀 Starting migration from markdown to Supabase...\n');

	try {
		// Read all markdown files
		const files = readdirSync(POSTS_DIR).filter((file) => file.endsWith('.md'));

		console.log(`Found ${files.length} markdown files\n`);

		let successCount = 0;
		let errorCount = 0;

		for (const file of files) {
			const slug = file.replace('.md', '');
			const filePath = join(POSTS_DIR, file);

			try {
				console.log(`Processing: ${file}`);

				// Parse markdown file
				const post = parseMarkdownFile(filePath, slug);

				// Check if post already exists
				const { data: existing } = await supabase
					.from('posts')
					.select('id')
					.eq('slug', slug)
					.single();

				if (existing) {
					// Update existing post
					const { error } = await supabase
						.from('posts')
						.update({
							title: post.frontmatter.title,
							subtitle: post.frontmatter.subtitle,
							form: post.frontmatter.form,
							category: post.frontmatter.category,
							date: post.frontmatter.date,
							tags: post.frontmatter.tags,
							chapter: post.frontmatter.chapter,
							excerpt: post.frontmatter.excerpt,
							content: post.content,
							published: post.frontmatter.published
						})
						.eq('slug', slug);

					if (error) throw error;
					console.log(`  ✅ Updated: ${slug}`);
				} else {
					// Insert new post
					const { error } = await supabase.from('posts').insert({
						slug,
						title: post.frontmatter.title,
						subtitle: post.frontmatter.subtitle,
						form: post.frontmatter.form,
						category: post.frontmatter.category,
						date: post.frontmatter.date,
						tags: post.frontmatter.tags,
						chapter: post.frontmatter.chapter,
						excerpt: post.frontmatter.excerpt,
						content: post.content,
						published: post.frontmatter.published
					});

					if (error) throw error;
					console.log(`  ✅ Inserted: ${slug}`);
				}

				successCount++;
			} catch (error) {
				console.error(`  ❌ Error processing ${file}:`, error);
				errorCount++;
			}

			console.log('');
		}

		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
		console.log(`✅ Migration complete!`);
		console.log(`   Success: ${successCount}`);
		console.log(`   Errors: ${errorCount}`);
		console.log(`   Total: ${files.length}`);
		console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

		if (successCount > 0) {
			console.log('Next steps:');
			console.log('1. Verify posts in Supabase dashboard');
			console.log('2. Set up Directus to manage these posts');
			console.log('3. Update your app to use posts-supabase.ts instead of posts.ts');
			console.log('4. Test thoroughly before removing markdown files\n');
		}
	} catch (error) {
		console.error('❌ Migration failed:', error);
		process.exit(1);
	}
}

// Run migration
migratePosts();
