<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { convertDateSeparators, parseTags } from '$lib/utils';
	import { afterNavigate } from '$app/navigation';

	export let data: {
		posts: {
			chapter: string;
			title: string;
			category: string;
			tags: string[];
			date: string;
			slug: string;
		}[];
	};

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
		window.addEventListener('resize', updateViewport);
		document.addEventListener('click', handleClickOutside);
	});
	onDestroy(() => {
		window.removeEventListener('resize', updateViewport);
		document.removeEventListener('click', handleClickOutside);
	});

	// Sorting state for non-tag fields.
	type SortKey = 'chapter' | 'title' | 'category' | 'date';
	let sortBy: SortKey = 'date';
	let sortOrder: 'asc' | 'desc' = 'desc'; // default for date

	function handleSort(key: SortKey) {
		if (sortBy === key) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = key;
			sortOrder = key === 'date' ? 'desc' : 'asc';
		}
	}

	// Helper to compute the arrow for a given column.
	function arrowFor(key: SortKey) {
		if (sortBy === key) {
			return sortOrder === 'asc' ? '↑' : '↓';
		} else {
			// For unsorted columns, preview what order will be applied.
			return key === 'date' ? '↓' : '↑';
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
			if (tagButton && !path.includes(tagButton) && tagPopup && !path.includes(tagPopup)) {
				showTagBox = false;
			}
		}
	}

	// Compute unique tags from posts.
	$: allTags = Array.from(new Set(data.posts.flatMap((post) => post.tags)));

	// Reactive sorted posts for non-tag sorting.
	$: sortedPosts = [...data.posts].sort((a, b) => {
		if (sortBy === 'date') {
			const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
			return sortOrder === 'asc' ? diff : -diff;
		} else {
			return sortOrder === 'asc'
				? a[sortBy].localeCompare(b[sortBy])
				: b[sortBy].localeCompare(a[sortBy]);
		}
	});

	// Filter posts based on selected tags.
	$: filteredPosts = sortedPosts.filter((post) => {
		if (filterTags.length === 0) return true;
		return post.tags.some((tag) => filterTags.includes(tag));
	});

	function toggleTagSelection(tag: string) {
		if (filterTags.includes(tag)) {
			filterTags = filterTags.filter((t) => t !== tag);
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
	<div bind:this={element} class="flex h-full flex-col">
		<div class="mx-8 my-32 flex flex-col">
			<div class="mb-4 flex flex-row">
				<a href="/pond" class="serif-typo-title hover:animate-pulse">Archive</a>
			</div>

			<!-- Header row with clickable buttons -->
			<div class="archive-entry-sans-mobile flex flex-row items-center font-semibold">
				<button
					on:click={() => handleSort('title')}
					class="header-button w-1/2 text-left"
					class:sorted={sortBy === 'title'}
				>
					Title
					<span class="arrow archive-entry-mono">
						{sortBy === 'title' ? arrowFor('title') : arrowFor('title')}
					</span>
				</button>
				<button
					on:click={() => handleSort('category')}
					class="header-button w-3/10 text-left"
					class:sorted={sortBy === 'category'}
				>
					Article
					<span class="arrow archive-entry-mono">
						{sortBy === 'category' ? arrowFor('category') : arrowFor('category')}
					</span>
				</button>
				<!-- Date header -->
				<button
					on:click={() => handleSort('chapter')}
					class="header-button right-0 w-1/5 text-left"
					class:sorted={sortBy === 'chapter'}
				>
					Chapter
					<span class="arrow archive-entry-mono">
						{sortBy === 'chapter' ? arrowFor('chapter') : arrowFor('chapter')}
					</span>
				</button>
			</div>
			<hr class="bg-light my-2 h-px" />
			<!-- Posts list as a flex column -->
			<div class="flex flex-col">
				{#each filteredPosts as post}
					<a href={`/pond/${post.slug}`} class="w-full text-left">
						<div class="flex flex-row">
							<p class="archive-entry-sans-mobile w-1/2 pr-2 text-wrap">{post.title}</p>
							<p class="archive-entry-sans-mobile w-3/10 pr-2 text-wrap break-words hyphens-auto">
								{post.category}
							</p>
							<p class="archive-entry-mono-mobile w-1/10 text-wrap">{post.chapter}</p>
						</div>
						<hr class="bg-light my-2 h-px" />
					</a>
				{/each}
			</div>
			<div class="mt-8 flex justify-between">
				<a href="/pond" class="mono-typo-nav rounded-2xl border px-3 py-1 text-center"
					>&lt Current Chapter</a
				>
			</div>
		</div>
	</div>
{:else}
	<div bind:this={element} class="flex h-full flex-col">
		<div class="mx-32 my-32 flex flex-col">
			<div class="mb-4 flex flex-row">
				<a href="/pond" class="serif-typo-page-title text-xl hover:animate-pulse">Archive</a>
			</div>
			<!-- Header row with clickable buttons -->
			<div class="archive-entry-sans flex flex-row items-center font-semibold">
				<!-- Chapter header -->
				<button
					on:click={() => handleSort('chapter')}
					class="header-button w-1/10 text-left"
					class:sorted={sortBy === 'chapter'}
				>
					Chapter
					<span class="arrow archive-entry-mono">
						{sortBy === 'chapter' ? arrowFor('chapter') : arrowFor('chapter')}
					</span>
				</button>
				<!-- Title header -->
				<button
					on:click={() => handleSort('title')}
					class="header-button w-2/10 text-left"
					class:sorted={sortBy === 'title'}
				>
					Title
					<span class="arrow archive-entry-mono">
						{sortBy === 'title' ? arrowFor('title') : arrowFor('title')}
					</span>
				</button>
				<!-- Category header -->
				<button
					on:click={() => handleSort('category')}
					class="header-button w-1/5 text-left"
					class:sorted={sortBy === 'category'}
				>
					Article
					<span class="arrow archive-entry-mono">
						{sortBy === 'category' ? arrowFor('category') : arrowFor('category')}
					</span>
				</button>
				<!-- Tags header with inline tag box -->
				<div class="relative w-4/10">
					<button
						bind:this={tagButton}
						on:click={() => (showTagBox = !showTagBox)}
						class="header-button tag-button text-left"
					>
						Tags
						<span
							class="tag-brackets archive-entry-mono"
							class:always-visible={filterTags.length > 0}
						>
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
						<div
							bind:this={tagPopup}
							class="archive-entry-mono bg-dark absolute left-0 z-10 mt-2 flex w-3/4 flex-col gap-2 border p-2 transition-opacity duration-200"
						>
							<div class="flex flex-wrap">
								{#each allTags as tag}
									<button
										on:click={() => toggleTagSelection(tag)}
										class="px-1 py-0.5 hover:font-bold"
										class:font-bold={filterTags.includes(tag)}
									>
										{tag}
									</button>
								{/each}
							</div>
							<div class="flex justify-between pt-4">
								<button
									class="text-pond-hover p-1 underline decoration-wavy"
									on:click={clearTagFilter}>Clear</button
								>
								<button
									class="text-pond-hover p-1 underline decoration-wavy"
									on:click={applyTagFilter}>Close</button
								>
							</div>
						</div>
					{/if}
				</div>
				<!-- Date header -->
				<button
					on:click={() => handleSort('date')}
					class="header-button w-1/10 text-left"
					class:sorted={sortBy === 'date'}
				>
					Date
					<span class="arrow archive-entry-mono">
						{sortBy === 'date' ? arrowFor('date') : arrowFor('date')}
					</span>
				</button>
			</div>
			<hr class="bg-light my-2 h-px" />
			<!-- Posts list as a flex column -->
			<div class="flex flex-col">
				{#each filteredPosts as post}
					<a href={`/pond/${post.slug}`} class="w-full text-left">
						<div class="text-pond-hover flex flex-row">
							<p class="archive-entry-sans w-1/10 pr-2 text-wrap italic">{post.chapter}</p>
							<p class="archive-entry-sans w-2/10 pr-2 text-wrap">{post.title}</p>
							<p class="archive-entry-sans w-2/10 pr-2 text-wrap">{post.category}</p>
							<p class="archive-entry-mono w-4/10 pr-2 text-wrap">{parseTags(post.tags)}</p>
							<p class="archive-entry-mono w-1/10 text-wrap">{convertDateSeparators(post.date)}</p>
						</div>
						<hr class="bg-light my-2 h-px" />
					</a>
				{/each}
			</div>
			<div class="mt-8 flex justify-between">
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
