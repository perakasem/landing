<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { convertDateSeparators, parseTags } from "$lib/utils";
    import {afterNavigate} from "$app/navigation";

    export let data: { posts: {
            chapter: string;
            title: string;
            category: string;
            tags: string[];
            date: string;
            slug: string;
        }[] };

    const mobileBreakpoint = 1000;
    let isMobile = false;
    let isHovered = false;
    let element = null;

    function updateViewport() {
        isMobile = window.innerWidth < mobileBreakpoint;
    }

    afterNavigate(() => {
        element!.scrollIntoView();
    });

    onMount(() => {
        updateViewport();
        window.addEventListener("resize", updateViewport);
        document.addEventListener("click", handleClickOutside);
    });
    onDestroy(() => {
        window.removeEventListener("resize", updateViewport);
        document.removeEventListener("click", handleClickOutside);
    });

    // Sorting state for non-tag fields.
    type SortKey = "chapter" | "title" | "category" | "date";
    let sortBy: SortKey = "date";
    let sortOrder: "asc" | "desc" = "desc"; // default for date

    function handleSort(key: SortKey) {
        if (sortBy === key) {
            sortOrder = sortOrder === "asc" ? "desc" : "asc";
        } else {
            sortBy = key;
            sortOrder = key === "date" ? "desc" : "asc";
        }
    }

    // Helper to compute the arrow for a given column.
    function arrowFor(key: SortKey) {
        if (sortBy === key) {
            return sortOrder === "asc" ? "↑" : "↓";
        } else {
            // For unsorted columns, preview what order will be applied.
            return key === "date" ? "↓" : "↑";
        }
    }

    // For tag filtering.
    let showTagBox = false;
    let filterTags: string[] = []; // if empty, means no filter

    // References for tag button and popup.
    let tagButton: HTMLButtonElement;
    let tagPopup: HTMLDivElement;

    // Click outside logic.
    function handleClickOutside(event: MouseEvent) {
        if (showTagBox) {
            const path = event.composedPath();
            if (
                tagButton && !path.includes(tagButton) &&
                tagPopup && !path.includes(tagPopup)
            ) {
                showTagBox = false;
            }
        }
    }

    // Compute unique tags from posts.
    $: allTags = Array.from(new Set(data.posts.flatMap(post => post.tags)));

    // Reactive sorted posts for non-tag sorting.
    $: sortedPosts = [...data.posts].sort((a, b) => {
        if (sortBy === "date") {
            const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
            return sortOrder === "asc" ? diff : -diff;
        } else {
            return sortOrder === "asc"
                ? a[sortBy].localeCompare(b[sortBy])
                : b[sortBy].localeCompare(a[sortBy]);
        }
    });

    // Filter posts based on selected tags.
    $: filteredPosts = sortedPosts.filter(post => {
        if (filterTags.length === 0) return true;
        return post.tags.some(tag => filterTags.includes(tag));
    });

    function toggleTagSelection(tag: string) {
        if (filterTags.includes(tag)) {
            filterTags = filterTags.filter(t => t !== tag);
        } else {
            filterTags = [...filterTags, tag];
        }
    }

    function clearTagFilter() {
        filterTags = [];
        showTagBox = false;
    }

    function applyTagFilter() {
        showTagBox = false;
    }
</script>

{#if isMobile}
    <div bind:this={element} class="flex flex-col h-full">
        <div class="my-32 mx-8 flex flex-col">
            <div class="flex flex-row mb-4">
                <a href="/pond" class="serif-typo-title hover:animate-pulse">Archive</a>
            </div>
            <!-- Header row with clickable buttons -->
            <div class="flex flex-row archive-entry-sans-mobile font-semibold items-center">
                <button on:click={() => handleSort("title")} class="w-1/2 text-left header-button" class:sorted={sortBy === 'title'}>
                    Title
                    <span class="arrow archive-entry-mono">
                        {sortBy === "title" ? arrowFor("title") : arrowFor("title")}
                    </span>
                </button>
                <button on:click={() => handleSort("category")} class="w-3/10 text-left header-button" class:sorted={sortBy === 'category'}>
                    Article
                    <span class="arrow archive-entry-mono">
                        {sortBy === "category" ? arrowFor("category") : arrowFor("category")}
                    </span>
                </button>
                <!-- Date header -->
                <button on:click={() => handleSort("chapter")} class="w-1/5 right-0 text-left header-button" class:sorted={sortBy === 'chapter'}>
                    Chapter
                    <span class="arrow archive-entry-mono">
                        {sortBy === "chapter" ? arrowFor("chapter") : arrowFor("chapter")}
                    </span>
                </button>
            </div>
            <hr class="h-px bg-light my-2">
            <!-- Posts list as a flex column -->
            <div class="flex flex-col">
                {#each filteredPosts as post}
                    <a href={`/pond/${post.slug}`} class="w-full text-left">
                        <div class="flex flex-row">
                            <p class="text-wrap w-1/2 archive-entry-sans-mobile pr-2">{post.title}</p>
                            <p class="text-wrap w-3/10 archive-entry-sans-mobile break-words hyphens-auto pr-2">{post.category}</p>
                            <p class="text-wrap w-1/10 archive-entry-mono-mobile">{post.chapter}</p>
                        </div>
                        <hr class="h-px bg-light my-2">
                    </a>
                {/each}
            </div>
            <div class="flex justify-between mt-8">
                <a href="/pond" class="mono-typo-nav border rounded-2xl px-3 py-1 text-center">&lt Current Chapter</a>
            </div>
        </div>
    </div>
{:else}
    <div bind:this={element} class="flex flex-col h-full">
        <div class="my-32 mx-32 flex flex-col">
            <div class="flex flex-row mb-4">
                <a href="/pond" class="serif-typo-page-title text-xl hover:animate-pulse">Archive</a>
            </div>
            <!-- Header row with clickable buttons -->
            <div class="flex flex-row archive-entry-sans font-semibold items-center">
                <!-- Chapter header -->
                <button on:click={() => handleSort("chapter")} class="w-1/10 text-left header-button" class:sorted={sortBy === 'chapter'}>
                    Chapter
                    <span class="arrow archive-entry-mono">
                        {sortBy === "chapter" ? arrowFor("chapter") : arrowFor("chapter")}
                    </span>
                </button>
                <!-- Title header -->
                <button on:click={() => handleSort("title")} class="w-2/10 text-left header-button" class:sorted={sortBy === 'title'}>
                    Title
                    <span class="arrow archive-entry-mono">
                        {sortBy === "title" ? arrowFor("title") : arrowFor("title")}
                    </span>
                </button>
                <!-- Category header -->
                <button on:click={() => handleSort("category")} class="w-1/5 text-left header-button" class:sorted={sortBy === 'category'}>
                    Article
                    <span class="arrow archive-entry-mono">
                        {sortBy === "category" ? arrowFor("category") : arrowFor("category")}
                    </span>
                </button>
                <!-- Tags header with inline tag box -->
                <div class="relative w-4/10">
                    <button bind:this={tagButton} on:click={() => showTagBox = !showTagBox} class="header-button text-left tag-button">
                        Tags
                        <span class="tag-brackets archive-entry-mono" class:always-visible={filterTags.length > 0}>
                            [
                            {#if filterTags.length === 0}
                                all
                            {:else}
                                {filterTags.length}
                            {/if}
                            ]
                        </span>
                    </button>
                    {#if showTagBox}
                        <div bind:this={tagPopup} class="absolute border mt-2 left-0 p-2 w-3/4 archive-entry-mono bg-dark flex flex-col gap-2 z-10 transition-opacity duration-200">
                            <div class="flex flex-wrap">
                                {#each allTags as tag}
                                    <button
                                            on:click={() => toggleTagSelection(tag)}
                                            class="px-1 py-0.5 hover:font-bold"
                                            class:font-bold={filterTags.includes(tag)}>
                                        {tag}
                                    </button>
                                {/each}
                            </div>
                            <div class="flex justify-between pt-4">
                                <button class="p-1 text-pond-hover underline decoration-wavy" on:click={clearTagFilter}>Clear</button>
                                <button class="p-1 text-pond-hover underline decoration-wavy" on:click={applyTagFilter}>Close</button>
                            </div>
                        </div>
                    {/if}
                </div>
                <!-- Date header -->
                <button on:click={() => handleSort("date")} class="w-1/10 text-left header-button" class:sorted={sortBy === 'date'}>
                    Date
                    <span class="arrow archive-entry-mono">
                        {sortBy === "date" ? arrowFor("date") : arrowFor("date")}
                    </span>
                </button>
            </div>
            <hr class="h-px bg-light my-2">
            <!-- Posts list as a flex column -->
            <div class="flex flex-col">
                {#each filteredPosts as post}
                    <a href={`/pond/${post.slug}`} class="w-full text-left">
                        <div class="flex flex-row text-pond-hover">
                            <p class="text-wrap w-1/10 archive-entry-sans italic pr-2">{post.chapter}</p>
                            <p class="text-wrap w-2/10 archive-entry-sans pr-2">{post.title}</p>
                            <p class="text-wrap w-2/10 archive-entry-sans pr-2">{post.category}</p>
                            <p class="text-wrap w-4/10 archive-entry-mono pr-2">{parseTags(post.tags)}</p>
                            <p class="text-wrap w-1/10 archive-entry-mono">{convertDateSeparators(post.date)}</p>
                        </div>
                        <hr class="h-px bg-light my-2">
                    </a>
                {/each}
            </div>
            <div class="flex justify-between mt-8">
                <a href="/pond" class="mono-typo-nav hover:underline">&lt Current Chapter</a>
            </div>
        </div>
    </div>
{/if}

<style>
    .header-button {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        position: relative;
    }
    .header-button:focus {
        outline: none;
    }
    /* Arrow styling: unsorted arrows only appear on hover; sorted ones always visible */
    .arrow {
        margin-left: 0.25rem;
        opacity: 0;
        transition: opacity 0.2s;
    }
    .header-button:hover .arrow {
        opacity: 1;
    }
    .header-button.sorted .arrow {
        opacity: 1;
    }
    /* Tag brackets: hidden by default if no filter applied, always visible if filters are applied */
    .tag-brackets {
        opacity: 0;
        transition: opacity 0.2s;
        margin-left: 0.5rem;
    }
    .tag-button:hover .tag-brackets {
        opacity: 1;
    }
    .always-visible {
        opacity: 1 !important;
    }
</style>
