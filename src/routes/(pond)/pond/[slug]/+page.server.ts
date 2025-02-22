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

    // Sort descending: newest posts first
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const currentIndex = posts.findIndex(p => p.slug === params.slug);
    if (currentIndex === -1) {
        throw error(404, `Post not found: ${params.slug}`);
    }

    // Use modulo arithmetic to cycle through posts.
    const total = posts.length;
    const previousPost = posts[(currentIndex + 1) % total]; // next newer (cycling to beginning if needed)
    const nextPost = posts[(currentIndex - 1 + total) % total]; // next older (cycling to end if needed)

    return {
        meta: posts[currentIndex],
        slug: params.slug,
        previousPost,
        nextPost
    };
}

