import { describe, it, expect, beforeAll } from 'vitest';
import { db } from '$lib/supabase';

/**
 * INTEGRATION TESTS - Database Connectivity
 * ==========================================
 * These tests verify that critical database queries work correctly.
 * If these fail, the entire site will be broken.
 *
 * NOTE: These tests require a valid Supabase connection.
 * Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY in .env
 *
 * To skip these tests in CI without credentials:
 * Run: npm test -- --exclude integration
 */

const INTEGRATION_TEST_TAG = '[INTEGRATION]';

describe(`${INTEGRATION_TEST_TAG} Database Connection`, () => {
	it('should have database client configured', () => {
		expect(db).toBeDefined();
		expect(db.posts).toBeDefined();
		expect(db.siteConfig).toBeDefined();
	});

	it('should be able to query posts table', async () => {
		const { error } = await db.posts().select('id').limit(1);

		// Error might occur if table is empty or if there's a connection issue
		// We're just checking that the query doesn't throw and returns a proper structure
		expect(error).toBeNull();
	}, 10000); // 10 second timeout for network requests

	it('should be able to query site_config table', async () => {
		const { error } = await db.siteConfig().select('*').limit(1);

		expect(error).toBeNull();
	}, 10000);
});

describe(`${INTEGRATION_TEST_TAG} Posts Table Schema`, () => {
	it('should have correct columns in posts table', async () => {
		const { data, error } = await db.posts().select('*').limit(1).single();

		// If there's no data, we can't test the schema
		if (!data) {
			console.warn('No posts in database - skipping schema test');
			return;
		}

		expect(error).toBeNull();

		// Verify critical columns exist
		expect(data).toHaveProperty('id');
		expect(data).toHaveProperty('slug');
		expect(data).toHaveProperty('title');
		expect(data).toHaveProperty('content');
		expect(data).toHaveProperty('published');
		expect(data).toHaveProperty('date');
		expect(data).toHaveProperty('form');
		expect(data).toHaveProperty('category');
		expect(data).toHaveProperty('chapter');
		expect(data).toHaveProperty('tags');
	}, 10000);

	it('should handle JSONB array fields correctly', async () => {
		const { data, error } = await db
			.posts()
			.select('form, category, chapter, tags')
			.limit(1)
			.single();

		if (!data) {
			console.warn('No posts in database - skipping JSONB test');
			return;
		}

		expect(error).toBeNull();

		const row: any = data;
		// form, category, chapter should be arrays (JSONB)
		if (row.form) {
			expect(Array.isArray(row.form)).toBe(true);
		}
		if (row.category) {
			expect(Array.isArray(row.category)).toBe(true);
		}
		if (row.chapter) {
			expect(Array.isArray(row.chapter)).toBe(true);
		}
		// tags should always be an array
		if (row.tags) {
			expect(Array.isArray(row.tags)).toBe(true);
		}
	}, 10000);
});

describe(`${INTEGRATION_TEST_TAG} Site Config Table`, () => {
	it('should have site config data', async () => {
		const { data, error } = await db.siteConfig().select('*').limit(1).single();

		expect(error).toBeNull();
		expect(data).toBeDefined();

		if (data) {
			// Verify critical config fields exist
			expect(data).toHaveProperty('title');
			expect(data).toHaveProperty('description');
			expect(data).toHaveProperty('current_chapter');
		}
	}, 10000);
});

describe(`${INTEGRATION_TEST_TAG} Query Performance`, () => {
	it('should fetch posts in reasonable time', async () => {
		const start = Date.now();

		await db.posts().select('*').eq('published', true).limit(10);

		const duration = Date.now() - start;

		// Should complete in under 2 seconds
		expect(duration).toBeLessThan(2000);
	}, 10000);

	it('should fetch config in reasonable time', async () => {
		const start = Date.now();

		await db.siteConfig().select('*').limit(1);

		const duration = Date.now() - start;

		// Should complete in under 1 second
		expect(duration).toBeLessThan(1000);
	}, 10000);
});

describe(`${INTEGRATION_TEST_TAG} RLS Policies`, () => {
	it('should allow anonymous read access to published posts', async () => {
		const { data, error } = await db.posts().select('*').eq('published', true).limit(1);

		// Should not get permission denied error
		expect(error).toBeNull();
		expect(data).toBeDefined();
	}, 10000);

	it('should allow anonymous read access to site config', async () => {
		const { data, error } = await db.siteConfig().select('*').limit(1);

		// Should not get permission denied error
		expect(error).toBeNull();
		expect(data).toBeDefined();
	}, 10000);
});
