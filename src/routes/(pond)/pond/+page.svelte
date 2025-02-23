<script lang="ts">
    import {onMount} from "svelte";
    import * as config from '$lib/config'

    export let data;

    const mobileBreakpoint = 640;
    let isMobile = false;

    function updateViewport() {
        isMobile = window.innerWidth < mobileBreakpoint;
    }

    onMount(() => {
        updateViewport();
        window.addEventListener('resize', updateViewport);
        return () => window.removeEventListener('resize', updateViewport);
    })
</script>

{#if isMobile}
    <div class="p-8 flex flex-col h-full overflow-y-auto">
        <div class="pt-12 mb-40 mt-20">
            <h1 class="sans-typo-title-small text-xl mb-1 text-wrap">Under Construction</h1>
            <p class="p-4 serif-typo-body-small text-wrap">
                Still cooking this page up. It's gotta be perfect, yfm? Type shiiiii. Come back soon!
            </p>
            <a href="/static" class="sans-typo-detail hover:underline">Home</a>
        </div>
    </div>
{:else}
    <div class="fixed w-1/3 right-0 top-0 h-full bg-no-repeat bg-cover bg-center" style="background-image: url('/artwork.png');"></div>
    <div class="flex flex-col h-full">
        <div class="my-42 flex w-2/3">
            <div class="flex flex-col w-3/5 pl-42 pr-16">
                <div class="flex flex-col">
                    <p class="text-pond-blue sans-typo">
                        Latest
                    </p>
                    <ul>
                        {#each data.posts as post}
                            {#if post.form === 'longform' && post.chapter === config.currentChapter}
                                <li class="mb-8">
                                    <a href={`/pond/${post.slug}`}>
                                        <div class="text-pond-hover flex flex-col">
                                            <h2 class="serif-typo-h1 text-wrap">{post.title}</h2>
                                            <p class="sans-typo-title-thin text-wrap">{post.subtitle}</p>
                                        </div>
                                    </a>
                                </li>
                            {/if}
                        {/each}
                    </ul>
                    <p class="text-pond-blue sans-typo mt-16">
                        Shortform
                    </p>
                    <ul>
                        {#each data.posts as post}
                            {#if post.form === 'shortform' && post.chapter === config.currentChapter}
                                <li class="mb-8">
                                    <a href={`/pond/${post.slug}`}>
                                        <div class="text-pond-hover flex flex-col">
                                            <h2 class="serif-typo-h1 text-wrap">{post.title}</h2>
                                            <p class="sans-typo-title-thin text-wrap">{post.subtitle}</p>
                                        </div>
                                    </a>
                                </li>
                            {/if}
                        {/each}
                    </ul>
                </div>
            </div>
            <div class="flex flex-col w-1/4 top-42 self-start sticky mr-42">
                <div class="flex flex-col items-center bg-dark w-full">
                    <div>
                        <h1 class="sans-typo">
                            {config.title}
                        </h1>
                        <p class="serif-typo-body text-wrap my-4">
                            {config.description}
                        </p>
                        <div class="flex flex-row flex-wrap mono-typo-nav my-8">
                            <a href="/rss.xml" class="text-pond-hover mr-4"
                               target="_blank"
                               rel="noopener noreferrer"
                            >
                                RSS
                            </a>
                            <a href="/pond/archive" class="text-pond-hover mr-4">Archive &gt</a>
                            <a href="/construction" class="text-pond-hover">Dump &gt</a>
                        </div>
                        <hr class="h-px bg-light my-8 w-full">
                        <h2 class="mono-typo-nav font-bold mt-10 my-6">In Rotation</h2>
                        <div class="flex flex-col mono-typo-nav text-wrap">
                            <a href="https://www.youtube.com/watch?v=Wn2vgQGNI_c&t=0s"
                               class="mb-2 text-pond-hover"
                               target="_blank"
                               rel="noopener noreferrer">
                                <p class="mb-1">On Information Hazards</p>
                                <p class="font-bold mb-2">Anders Sandberg</p>
                            </a>
                            <a href="https://youtu.be/F0cdbR5ognY?si=L6HZyjQ2UGlSyJI6"
                               class="mb-2 text-pond-hover"
                               target="_blank"
                               rel="noopener noreferrer">
                                <p class="mb-1">Denial is a River (in Egypt, your husband is gay)</p>
                                <p class="font-bold mb-2">Doechii</p>
                            </a>
                            <a href="https://forum.effectivealtruism.org/posts/3ryvsSZWd5vqgY7bg/how-ai-takeover-might-happen-in-two-years?"
                               class="mb-2 text-pond-hover"
                               target="_blank"
                               rel="noopener noreferrer">
                                <p class="mb-1">A Looming AI Takeover</p>
                                <p class="font-bold mb-2">Joshua Clymer</p>
                            </a>
                        </div>
                        <h2 class="mono-typo-nav font-bold mt-10 my-6">Featured Artwork &gt</h2>
                        <div class="flex flex-col mono-typo-nav text-wrap">
                            <div class="mb-2">
                                <p class="mb-1">Foundations of Flavor</p>
                                <p class="font-bold mb-2">Paula Troxler via Noma</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
