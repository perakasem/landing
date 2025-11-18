import { error } from '@sveltejs/kit';
import { getPostBySlug, getNavigationPosts } from '$lib/server/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	// Get the current post
	const post = await getPostBySlug(slug);

	if (!post) {
		throw error(404, `Post not found: ${slug}`);
	}

	// Get navigation posts (previous and next)
	const { previousPost, nextPost } = await getNavigationPosts(slug);

	return {
		meta: post,
		slug,
		previousPost,
		nextPost
	};
};
