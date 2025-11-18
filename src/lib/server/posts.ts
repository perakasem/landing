import type { Post } from '$lib/types';
import { extractSlugFromPath, sortPostsByDate } from '$lib/utils';

/**
 * Get all published posts from the posts directory
 * Posts are sorted by date in descending order (newest first)
 * @returns Array of published posts
 */
export async function getPosts(): Promise<Post[]> {
	const posts: Post[] = [];
	const paths = import.meta.glob('/src/posts/*.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		const slug = extractSlugFromPath(path);

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>;
			const post = { ...metadata, slug } satisfies Post;
			if (post.published) {
				posts.push(post);
			}
		}
	}

	return sortPostsByDate(posts, 'desc');
}

/**
 * Get all posts including drafts
 * Useful for admin/preview functionality
 * @returns Array of all posts (published and unpublished)
 */
export async function getAllPosts(): Promise<Post[]> {
	const posts: Post[] = [];
	const paths = import.meta.glob('/src/posts/*.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		const slug = extractSlugFromPath(path);

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>;
			const post = { ...metadata, slug } satisfies Post;
			posts.push(post);
		}
	}

	return sortPostsByDate(posts, 'desc');
}

/**
 * Get a single post by its slug
 * @param slug - The post slug to find
 * @returns The post if found, null otherwise
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
	const posts = await getPosts();
	return posts.find((p) => p.slug === slug) ?? null;
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
