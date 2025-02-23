<script lang="ts">
    import type { SvelteComponent } from 'svelte';
    import type { Post } from '$lib/types';
    import { formatDate } from '$lib/utils';
    import ScrollProgress from "../../../../components/ScrollProgress.svelte";

    export let data: {
        meta: Post;
        slug: string;
        previousPost: Post;
        nextPost: Post;
    };

    let element: HTMLElement;
    type MarkdownModule = {
        metadata: Omit<typeof data.meta, 'slug'>;
        default: typeof SvelteComponent;
    };

    let Content: typeof SvelteComponent | null = null;

    // Mapping of posts available via glob.
    const posts = import.meta.glob('../../../../posts/*.md');

    // Reactive statement: whenever data.slug changes, load new markdown content and scroll to top.
    $: (async () => {
        const path = `../../../../posts/${data.slug}.md`;
        if (posts[path]) {
            const mod = (await posts[path]()) as MarkdownModule;
            Content = mod.default;
        } else {
            console.error(`Could not find post for slug: ${data.slug}`);
            Content = null;
        }
        // Scroll to the top of the element (or window) when slug changes.
        element?.scrollIntoView({ behavior: 'smooth' });
    })();
</script>


<svelte:head>
    <title>{data.meta.title} - My Blog</title>
    <meta property="og:type" content="article" />
    <meta property="og:title" content={data.meta.title} />
</svelte:head>

<div bind:this={element} class="scroll-container">
    <ScrollProgress/>
    <article class="text-wrap mx-auto max-w-[750px] my-42">
        <div class="relative flex flex-row gap-2">
            <a href="/pond" class="absolute -ml-32 mono-typo-nav hover:underline">
                &lt; Pond
            </a>
            <p class="sans-typo-detail mb-4">{formatDate(data.meta.date)}</p>
        </div>
        <h1 class="-ml-8 mb-4">{data.meta.title}</h1>
        <h2>{data.meta.excerpt}</h2>
        <div class="content">
            {#if Content}
                <svelte:component this={Content} key={data.slug}/>
            {:else}
                <p>Loading post content...</p>
            {/if}
        </div>
        <hr class="h-px bg-light mt-32 mb-4 w-full">
        <div class="flex flex-row justify-between">
            <div class="sans-typo-detail flex flex-row gap-2 mb-8">
                <p class="font-semibold">categories: </p>
                {#each data.meta.tags as tag}
                    <span>{tag}</span>
                {/each}
            </div>
            <div class="flex flex-row h-fit">
                <p class="archive-entry-mono text-pond-blue">↑&nbsp</p>
                <button on:click={() => element.scrollIntoView()} class="hover:underline text-pond-blue mono-typo-nav">
                    Back to Top
                </button>
            </div>
        </div>
        <div class="flex flex-col gap-2 mono-typo-nav">
            {#if data.previousPost || data.nextPost}
                <nav class="flex justify-between items-center mt-4">
                    {#if data.previousPost}
                        <div class="text-left">
                            <p class="font-bold">Previous</p>
                            <a href={`/pond/${data.previousPost.slug}`} class="hover:underline">
                                {data.previousPost.title}
                            </a>
                        </div>
                    {:else}
                        <div></div>
                    {/if}

                    {#if data.nextPost}
                        <div class="text-right">
                            <p class="font-bold">Next</p>
                            <a href={`/pond/${data.nextPost.slug}`} class="hover:underline">
                                {data.nextPost.title}
                            </a>
                        </div>
                    {:else}
                        <div></div>
                    {/if}
                </nav>
            {/if}
        </div>
    </article>
</div>

<style>
    h1 {
        font-family: "Hedvig Letters Serif", serif;
        font-size: 3rem;
    }
    h2 {
        font-family: "Instrument Sans", sans-serif;
        font-size: 1.8rem;
        color: #5468FF;
    }
    .scroll-container {
        scroll-margin-top: 42rem; /* Adjust to the needed offset */
    }
    .content {
        margin-top: 2rem;
    }
    :global(.content p) {
        color: #DEDCDB;
        font-family: "Hedvig Letters Serif", serif;
        font-size: 1.1rem;
        font-style: normal;
        line-height: 1.8rem;
        letter-spacing: 0.01rem;
        margin-bottom: 1rem;
    }
    :global(.content h3) {
        color: #DEDCDB;
        font-family: "Hedvig Letters Serif", serif;
        font-size: 1.5rem;
        font-style: normal;
        line-height: 1.8rem;
        letter-spacing: 0.01rem;
        margin-top: 5rem;
        margin-bottom: 1rem;
    }
    :global(.content h4) {
        color: #DEDCDB;
        font-family: "Hedvig Letters Serif", serif;
        font-size: 1.3rem;
        font-style: normal;
        line-height: 1.8rem;
        letter-spacing: 0.01rem;
        margin-top: 2rem;
        margin-bottom: 1rem;
    }
    :global(.content blockquote) {
        color: #DEDCDB;
        font-family: "Hedvig Letters Serif", serif;
        font-size: 1.1rem;
        line-height: 1.8rem;
        letter-spacing: 0.01rem;
        margin-bottom: 1rem;
        margin-left: 2rem;
        margin-right: 3rem;
        padding-left: 1rem;
        border-left: 3px solid #DEDCDB;
    }
    :global(.content figcaption) {
        color: #DEDCDB;
        font-family: "Instrument Sans", sans-serif;
        font-size: 0.9rem;
        font-style: italic;
        line-height: 1.2rem;
        letter-spacing: 0.01rem;
        margin-bottom: 5rem;
        text-align: center;
    }
    :global(.content img) {
        margin-left: auto;
        margin-right: auto;
        margin-top: 5rem;
        margin-bottom: 2rem;
        max-width: 600px;
        max-height: 600px;
    }
    :global(.content iframe) {
        margin-left: auto;
        margin-right: auto;
        margin-top: 5rem;
        margin-bottom: 5rem;
        max-width: 750px;
        max-height: 600px;
    }
    :global(.content li) {
        color: #DEDCDB;
        font-family: "Hedvig Letters Serif", serif;
        font-size: 1.1rem;
        font-style: normal;
        line-height: 1.8rem;
        letter-spacing: 0.01rem;
    }
    :global(.content ul) {
        margin-bottom: 1rem;
        list-style-type: disc;
        padding-left: 2rem;
    }
    :global(.content ol) {
        margin-bottom: 1rem;
        list-style-type: decimal;
        padding-left: 2rem;
    }
    :global(.content code) {
        color: #DEDCDB;
        font-family: "JetBrains Mono", serif;
        font-size: 1.1rem;
        font-style: normal;
        line-height: 1.8rem;
        letter-spacing: 0.01rem;
        margin-bottom: 1rem;
    }
    :global(.content a) {
        color: #DEDCDB;
        font-family: "Hedvig Letters Serif", serif;
        font-size: 1.1rem;
        font-style: normal;
        text-decoration: wavy underline;
        line-height: 1.8rem;
        letter-spacing: 0.01rem;
        margin-bottom: 1rem;
    }
    :global(.content a):hover {
        color: #5468FF;
    }
    :global(.content hr) {
        margin-top: 2rem;
        margin-bottom: 1rem;
    }
    :global(.content .footnote-ref) {
        text-decoration: none;
        font-size: 0.7rem;
        font-family: "JetBrains Mono", serif;
        color: #5468FF;
        margin-left: 2px;
    }
    :global(.content table) {
        width: 80%;
        border-collapse: collapse;
        margin-left: auto;
        margin-right: auto;
        margin-top: 2rem;
        margin-bottom: 2rem;
    }
    :global(.content th),
    :global(.content td) {
        border: 1px solid #ddd;
        padding: 0.5rem;
        color: #DEDCDB;
        font-family: "Hedvig Letters Serif", serif;
        font-size: 1.1rem;
        font-style: normal;
        line-height: 1.6rem;
        letter-spacing: 0.01rem;
        min-width: 3rem;
    }

    :global(.content thead) {
        background-color: #202020;
    }
</style>
