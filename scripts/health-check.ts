#!/usr/bin/env node
/**
 * PRE-DEPLOYMENT HEALTH CHECK
 * ===========================
 * This script verifies that all critical systems are working before deployment.
 *
 * Usage:
 *   npm run health-check
 *   node --loader ts-node/esm scripts/health-check.ts
 *
 * Exit codes:
 *   0 - All checks passed
 *   1 - One or more checks failed
 */

import { createClient } from '@supabase/supabase-js';

// Color output for terminal
const colors = {
	reset: '\x1b[0m',
	green: '\x1b[32m',
	red: '\x1b[31m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m'
};

function log(message: string, color: keyof typeof colors = 'reset') {
	console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message: string) {
	log(`✓ ${message}`, 'green');
}

function error(message: string) {
	log(`✗ ${message}`, 'red');
}

function warning(message: string) {
	log(`⚠ ${message}`, 'yellow');
}

function info(message: string) {
	log(`ℹ ${message}`, 'blue');
}

let failedChecks = 0;

/**
 * Check 1: Environment Variables
 */
async function checkEnvironmentVariables() {
	info('Checking environment variables...');

	const required = ['PUBLIC_SUPABASE_URL', 'PUBLIC_SUPABASE_ANON_KEY'];

	for (const varName of required) {
		const value = process.env[varName];
		if (!value) {
			error(`Missing required environment variable: ${varName}`);
			failedChecks++;
		} else {
			success(`${varName} is set`);
		}
	}

	console.log('');
}

/**
 * Check 2: Database Connection
 */
async function checkDatabaseConnection() {
	info('Checking database connection...');

	const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
	const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseKey) {
		error('Cannot check database - environment variables not set');
		failedChecks++;
		console.log('');
		return;
	}

	try {
		const supabase = createClient(supabaseUrl, supabaseKey, {
			auth: { persistSession: false }
		});

		const { error: dbError } = await supabase.from('posts').select('id').limit(1);

		if (dbError) {
			error(`Database connection failed: ${dbError.message}`);
			failedChecks++;
		} else {
			success('Database connection successful');
		}
	} catch (err) {
		error(`Database connection error: ${err}`);
		failedChecks++;
	}

	console.log('');
}

/**
 * Check 3: Posts Table
 */
async function checkPostsTable() {
	info('Checking posts table...');

	const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
	const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseKey) {
		error('Cannot check posts table - environment variables not set');
		failedChecks++;
		console.log('');
		return;
	}

	try {
		const supabase = createClient(supabaseUrl, supabaseKey, {
			auth: { persistSession: false }
		});

		// Check table exists and has correct structure
		const { data, error: queryError } = await supabase
			.from('posts')
			.select('id, slug, title, content, published, date, form, category, chapter, tags')
			.limit(1);

		if (queryError) {
			error(`Posts table query failed: ${queryError.message}`);
			failedChecks++;
		} else {
			success('Posts table structure is valid');

			// Check if table has data
			if (!data || data.length === 0) {
				warning('Posts table is empty - no content to display');
			} else {
				success(`Posts table has ${data.length} record(s)`);

				// Verify JSONB array fields
				const post = data[0];
				if (post.form && !Array.isArray(post.form)) {
					error('Post "form" field is not an array - JSONB conversion failed');
					failedChecks++;
				}
				if (post.category && !Array.isArray(post.category)) {
					error('Post "category" field is not an array - JSONB conversion failed');
					failedChecks++;
				}
				if (post.chapter && !Array.isArray(post.chapter)) {
					error('Post "chapter" field is not an array - JSONB conversion failed');
					failedChecks++;
				}
				if (post.form && Array.isArray(post.form)) {
					success('JSONB array fields are correctly formatted');
				}
			}
		}

		// Check published posts
		const { data: published, error: publishedError } = await supabase
			.from('posts')
			.select('id')
			.eq('published', true);

		if (publishedError) {
			error(`Failed to query published posts: ${publishedError.message}`);
			failedChecks++;
		} else {
			if (!published || published.length === 0) {
				warning('No published posts found - blog will be empty');
			} else {
				success(`Found ${published.length} published post(s)`);
			}
		}
	} catch (err) {
		error(`Posts table check error: ${err}`);
		failedChecks++;
	}

	console.log('');
}

/**
 * Check 4: Site Config Table
 */
async function checkSiteConfigTable() {
	info('Checking site_config table...');

	const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
	const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseKey) {
		error('Cannot check site_config table - environment variables not set');
		failedChecks++;
		console.log('');
		return;
	}

	try {
		const supabase = createClient(supabaseUrl, supabaseKey, {
			auth: { persistSession: false }
		});

		const { data, error: queryError } = await supabase.from('site_config').select('*').limit(1);

		if (queryError) {
			error(`Site config table query failed: ${queryError.message}`);
			failedChecks++;
		} else if (!data || data.length === 0) {
			error('Site config table is empty - site configuration will fail');
			failedChecks++;
		} else {
			success('Site config table has data');

			const config = data[0];
			const requiredFields = ['title', 'description', 'current_chapter'];

			for (const field of requiredFields) {
				if (!config[field]) {
					warning(`Site config missing field: ${field}`);
				}
			}

			success('Site config table is valid');
		}
	} catch (err) {
		error(`Site config check error: ${err}`);
		failedChecks++;
	}

	console.log('');
}

/**
 * Check 5: Build Process
 */
async function checkBuildProcess() {
	info('Checking build process...');

	// Check if node_modules exists
	const fs = await import('fs');
	const path = await import('path');

	const nodeModulesPath = path.join(process.cwd(), 'node_modules');
	if (!fs.existsSync(nodeModulesPath)) {
		error('node_modules not found - run npm install');
		failedChecks++;
	} else {
		success('node_modules exists');
	}

	// Check if critical dependencies are installed
	const criticalDeps = ['@sveltejs/kit', 'svelte', '@supabase/supabase-js', 'tailwindcss'];

	for (const dep of criticalDeps) {
		const depPath = path.join(nodeModulesPath, dep);
		if (!fs.existsSync(depPath)) {
			error(`Critical dependency missing: ${dep}`);
			failedChecks++;
		} else {
			success(`${dep} is installed`);
		}
	}

	console.log('');
}

/**
 * Check 6: Type Safety
 */
async function checkTypeSafety() {
	info('Checking TypeScript types...');

	const fs = await import('fs');
	const path = await import('path');

	const typesPath = path.join(process.cwd(), 'src/lib/types/database.ts');
	if (!fs.existsSync(typesPath)) {
		error('Database types file not found - run type generation');
		failedChecks++;
	} else {
		success('Database types file exists');
	}

	console.log('');
}

/**
 * Main execution
 */
async function main() {
	log('='.repeat(50), 'blue');
	log('PRE-DEPLOYMENT HEALTH CHECK', 'blue');
	log('='.repeat(50), 'blue');
	console.log('');

	await checkEnvironmentVariables();
	await checkDatabaseConnection();
	await checkPostsTable();
	await checkSiteConfigTable();
	await checkBuildProcess();
	await checkTypeSafety();

	log('='.repeat(50), 'blue');
	if (failedChecks === 0) {
		success('ALL CHECKS PASSED ✓');
		log('='.repeat(50), 'blue');
		process.exit(0);
	} else {
		error(`${failedChecks} CHECK(S) FAILED ✗`);
		log('='.repeat(50), 'blue');
		process.exit(1);
	}
}

main().catch((err) => {
	error(`Health check failed with error: ${err}`);
	process.exit(1);
});
