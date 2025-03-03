import type { Post } from '$lib/types';
import { getPosts } from '$lib/server/posts';

export async function load() {
    const posts: Post[] = await getPosts();
    return { posts };
}
