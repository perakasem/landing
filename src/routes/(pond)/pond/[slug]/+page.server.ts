import { error } from '@sveltejs/kit';
import type { Post } from '$lib/types';

type MarkdownModule = {
    metadata: Post;
    default: unknown;
};

export async function load({ params }) {
    const modules = import.meta.glob('../../../../posts/*.md');

    const posts: Post[] = await Promise.all(
        Object.entries(modules).map(async ([path, resolver]) => {
            const mod = (await resolver()) as MarkdownModule;
            const slug = path.split('/').pop()!.replace(/\.md$/, '');
            return { ...mod.metadata, slug };
        })
    );

    // Filter out posts that are not published.
    const publishedPosts = posts.filter(post => post.published);

    // Sort descending: newest posts first.
    publishedPosts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const currentIndex = publishedPosts.findIndex(p => p.slug === params.slug);
    if (currentIndex === -1) {
        throw error(404, `Post not found: ${params.slug}`);
    }

    const total = publishedPosts.length;
    let previousPost = null;
    let nextPost = null;

    // If there's more than one post, calculate previous and next.
    if (total > 1) {
        previousPost = publishedPosts[(currentIndex + 1) % total];
        nextPost = publishedPosts[(currentIndex - 1 + total) % total];

        // If previous or next post is the same as the current post, set it to null.
        if (previousPost.slug === params.slug) previousPost = null;
        if (nextPost.slug === params.slug) nextPost = null;
    }

    return {
        meta: publishedPosts[currentIndex],
        slug: params.slug,
        previousPost,
        nextPost
    };
}
