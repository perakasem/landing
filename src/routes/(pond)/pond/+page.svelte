<script lang="ts">
    import {onMount} from "svelte";
    import { slide } from "svelte/transition"
    import * as config from '$lib/pond.config'
    import {afterNavigate} from "$app/navigation";

    export let data;
    let activeSection: string | null = "rotation";

    const toggleSection = (id: string) => {
        activeSection = activeSection === id ? null : id;
    };

    const mobileBreakpoint = 700;
    let isMobile = false;

    function updateViewport() {
        isMobile = window.innerWidth < mobileBreakpoint;
    }

    function arrowFor(key: string) {
        if (activeSection === key) {
            return "∨";
        }
        return ">";
    }

    function arrowStyleFor(key: string) {
        if (activeSection === key) {
            return "sans-typo-detail";
        }
        return "mono-type-nav font-normal";
    }

    function scrollIntoView({ target }: any) {
        const el = document.querySelector(target.getAttribute('href'));
        if (!el) return;
        el.scrollIntoView({
            behavior: 'smooth'
        });
    }

    onMount(() => {
        updateViewport();
        window.addEventListener('resize', updateViewport);
        return () => window.removeEventListener('resize', updateViewport);
    })
</script>

{#if isMobile}
    <div class="flex flex-col h-full overflow-y-auto">
        <div class="pt-12 mb-40 mt-20">
            <div class="p-8 flex flex-col w-full">
                <div>
                    <h1 class="sans-typo">
                        {config.title}
                    </h1>
                    <p class="serif-typo-body text-wrap my-4">
                        {config.description}
                    </p>
                    <div class="flex flex-row flex-wrap mono-typo-nav gap-3 my-8">
                        <a href="#entries" class="font-bold border-2 rounded-2xl px-3 py-1 text-center text-pond-blue"
                           on:click|preventDefault={scrollIntoView}
                        >
                            Entries &gt
                        </a>
                        <a href="/pond/archive" class="border rounded-2xl px-3 py-1 text-center">Archive &gt</a>
                        <a href="/pond/dump" class="border rounded-2xl px-3 py-1 text-center">Dump &gt</a>
                    </div>
                    <button
                            on:click|preventDefault={() => toggleSection("rotation")}
                            class="mono-typo-nav {activeSection === 'rotation'}"
                    >
                        In Rotation <span class={arrowStyleFor("rotation")}>{arrowFor("rotation")}</span>
                    </button>
                    {#if activeSection === 'rotation'}
                        <div transition:slide class="flex flex-col mono-typo-nav max-w-70 text-wrap">
                            <div class="my-4 pl-4 border-l-2 flex flex-col gap-4">
                                <a href={config.watchUrl}
                                   class="text-pond-hover"
                                   target="_blank"
                                   rel="noopener noreferrer">
                                    <p class="mb-1">{config.watch}</p>
                                    <p class="font-bold mb-2">{config.watchSource}</p>
                                </a>
                                <a href={config.mediaUrl}
                                   class="text-pond-hover"
                                   target="_blank"
                                   rel="noopener noreferrer">
                                    <p class="mb-1">{config.media}</p>
                                    <p class="font-bold mb-2">{config.mediaSource}</p>
                                </a>
                                <a href={config.readUrl}
                                   class="text-pond-hover"
                                   target="_blank"
                                   rel="noopener noreferrer">
                                    <p class="mb-1">{config.read}</p>
                                    <p class="font-bold mb-2">{config.readSource}</p>
                                </a>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
            <img src={config.artworkSrc} alt="artwork" class="max-h-130 w-full object-cover pt-4">
            <p class="p-4 mono-typo-nav-mobile text-right w-full">{config.artwork}, {config.artist}</p>
            <div class="flex flex-col p-8" id="entries">
                <div class="flex flex-col">
                    <p class="text-pond-blue sans-typo-title-thin-mobile">
                        Latest
                    </p>
                    {#if data.posts.filter(post => post.form === 'longform' && post.chapter === config.currentChapter).length === 0}
                        <a href={`/pond/archive`}>
                            <div class="text-pond-hover flex flex-col">
                                <h2 class="serif-typo-h1-mobile text-wrap">Nothing to See Here</h2>
                                <p class="sans-typo-title-thin-mobile text-wrap">View All Posts</p>
                            </div>
                        </a>
                    {/if}
                    <ul>
                        {#each data.posts as post}
                            {#if post.form === 'longform' && post.chapter === config.currentChapter}
                                <li class="mb-8">
                                    <a href={`/pond/${post.slug}`}>
                                        <div class="text-pond-hover flex flex-col">
                                            <h2 class="serif-typo-h1-mobile text-wrap">{post.title}</h2>
                                            <p class="sans-typo-title-thin-mobile text-wrap">{post.subtitle}</p>
                                        </div>
                                    </a>
                                </li>
                            {/if}
                        {/each}
                    </ul>
                    <p class="text-pond-blue sans-typo-title-thin-mobile mt-8">
                        Shortform
                    </p>
                    {#if data.posts.filter(post => post.form === 'shortform' && post.chapter === config.currentChapter).length === 0}
                        <a href={`/pond/archive`}>
                            <div class="text-pond-hover flex flex-col">
                                <h2 class="serif-typo-h1-mobile text-wrap">Nothing to See Here</h2>
                                <p class="sans-typo-title-thin-mobile text-wrap">View All Posts</p>
                            </div>
                        </a>
                    {/if}
                    <ul>
                        {#each data.posts as post}
                            {#if post.form === 'shortform' && post.chapter === config.currentChapter}
                                <li class="mb-8">
                                    <a href={`/pond/${post.slug}`}>
                                        <div class="text-pond-hover flex flex-col">
                                            <h2 class="serif-typo-h1-mobile text-wrap">{post.title}</h2>
                                            <p class="sans-typo-title-thin-mobile text-wrap">{post.subtitle}</p>
                                        </div>
                                    </a>
                                </li>
                            {/if}
                        {/each}
                    </ul>
                </div>
            </div>
        </div>
    </div>
{:else}
    <div class="flex flex-row">
        <div class="flex flex-col h-full w-2/3">
            <div class="my-42 flex justify-center">
                <div class="flex flex-col flex-shrink-0 w-3/5 max-w-90 ml-16 pr-8">
                    <div class="flex flex-col">
                        <p class="text-pond-blue sans-typo">
                            Latest
                        </p>
                        {#if data.posts.filter(post => post.form === 'longform' && post.chapter === config.currentChapter).length === 0}
                            <a href={`/pond/archive`}>
                                <div class="text-pond-hover flex flex-col">
                                    <h2 class="serif-typo-h1 text-wrap">Nothing to See Here</h2>
                                    <p class="sans-typo-title-thin text-wrap">View All Posts</p>
                                </div>
                            </a>
                        {/if}
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
                        {#if data.posts.filter(post => post.form === 'shortform' && post.chapter === config.currentChapter).length === 0}
                            <a href={`/pond/archive`}>
                                <div class="text-pond-hover flex flex-col">
                                    <h2 class="serif-typo-h1 text-wrap">Nothing to See Here</h2>
                                    <p class="sans-typo-title-thin text-wrap">View All Posts</p>
                                </div>
                            </a>
                        {/if}
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
                <div class="flex-grow flex-shrink min-w-0 max-w-16"></div>
                <div class="flex flex-shrink-0 flex-col w-1/4 top-42 mr-16 self-start sticky text-wrap">
                    <div class="flex flex-col items-center w-full">
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
                                <a href="/pond/dump" class="text-pond-hover">Dump &gt</a>
                            </div>
                            <hr class="h-px bg-light my-8 w-full">
                            <button
                                    on:click|preventDefault={() => toggleSection("rotation")}
                                    class="mono-typo-nav hover:underline decoration-wavy {activeSection === 'rotation'}"
                            >
                                In Rotation <span class={arrowStyleFor("rotation")}>{arrowFor("rotation")}</span>
                            </button>
                            {#if activeSection === 'rotation'}
                                <div transition:slide class="flex flex-col mono-typo-nav max-w-70 text-wrap">
                                    <div class="my-4 pl-4 border-l-2 flex flex-col gap-4">
                                        <a href={config.watchUrl}
                                           class="text-pond-hover"
                                           target="_blank"
                                           rel="noopener noreferrer">
                                            <p class="mb-1">{config.watch}</p>
                                            <p class="font-bold mb-2">{config.watchSource}</p>
                                        </a>
                                        <a href={config.mediaUrl}
                                           class="text-pond-hover"
                                           target="_blank"
                                           rel="noopener noreferrer">
                                            <p class="mb-1">{config.media}</p>
                                            <p class="font-bold mb-2">{config.mediaSource}</p>
                                        </a>
                                        <a href={config.readUrl}
                                           class="text-pond-hover"
                                           target="_blank"
                                           rel="noopener noreferrer">
                                            <p class="mb-1">{config.read}</p>
                                            <p class="font-bold mb-2">{config.readSource}</p>
                                        </a>
                                    </div>

                                    <h2 class="mono-typo-nav font-bold mt-10 my-6">Featured Artwork &gt</h2>
                                    <div class="flex flex-col mono-typo-nav text-wrap">
                                        <div class="mb-2">
                                            <p class="mb-1">{config.artwork}</p>
                                            <p class="font-bold mb-2">{config.artist}</p>
                                        </div>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="sticky self-start top-0 right-0 w-1/3 h-screen z-20">
            <img src={config.artworkSrc} alt="artwork" class="h-full min-w-full object-cover">
        </div>
    </div>
{/if}
