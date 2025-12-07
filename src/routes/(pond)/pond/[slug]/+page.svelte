<script lang="ts">
	import { onMount } from 'svelte';
	import type { Post } from '$lib/types';
	import { formatDate } from '$lib/utils';
	import { markdownToHtml } from '$lib/markdown';
	import ScrollProgress from '../../../../components/ScrollProgress.svelte';
	import BackToTopButton from '../../../../components/BackToTopButton.svelte';

	export let data: {
		meta: Post;
		slug: string;
		previousPost: Post;
		nextPost: Post;
	};

	let element: HTMLElement;
	let isMobile = false;
	const mobileBreakpoint = 640;

	let html = '';

	$: (async () => {
		html = await markdownToHtml(data.meta.content);
	})();

	function updateViewport() {
		isMobile = window.innerWidth < mobileBreakpoint;
	}

	onMount(() => {
		updateViewport();
		window.addEventListener('resize', updateViewport);
	});
</script>

<svelte:head>
	<title>{data.meta.title} - My Blog</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

{#if isMobile}
	<div bind:this={element} class="scroll-container">
		<ScrollProgress />
		<article class="mx-8 py-42 text-wrap">
			<div class="relative flex flex-col gap-2">
				<a href="/pond" class="button-secondary-compact"> &lt; Home </a>
				<p class="sans-typo-detail my-4">{formatDate(data.meta.date)}</p>
			</div>
			<h1 class="mb-4">{data.meta.title}</h1>
			<h2>{data.meta.excerpt}</h2>
			<div class="content-mobile">
				{#if html}
					<p>{@html html}</p>
				{:else}
					<p>Loading post content...</p>
				{/if}
			</div>
			<hr class="bg-light mt-16 mb-4 h-px w-full" />
			<div class="sans-typo-detail my-4 flex flex-row gap-2">
				<p class="font-semibold">categories:</p>
				<div class="sans-typo-detail flex flex-wrap gap-x-2">
					{#each data.meta.tags as tag}
						<span>{tag}</span>
					{/each}
				</div>
			</div>
			<div class="mono-typo-nav flex flex-col gap-4">
				{#if data.previousPost || data.nextPost}
					<nav class="mt-4 flex items-center justify-between">
						{#if data.previousPost}
							<div class="text-left">
								<p class="font-bold">&lt Previous</p>
								<a href={`/pond/${data.previousPost.slug}`} class="text-wrap">
									{data.previousPost.title}
								</a>
							</div>
						{:else}
							<div></div>
						{/if}
						{#if data.nextPost}
							<div class="text-right">
								<p class="font-bold">Next &gt</p>
								<a href={`/pond/${data.nextPost.slug}`} class="text-wrap">
									{data.nextPost.title}
								</a>
							</div>
						{:else}
							<div></div>
						{/if}
					</nav>
				{/if}
			</div>
			<hr class="bg-light my-4 h-px w-full" />
			<BackToTopButton {element} variant="boxed" />
		</article>
	</div>

	<style>
		h1 {
			font-family: 'Hedvig Letters Serif', serif;
			font-size: 3rem;
			line-height: 3rem;
		}
		h2 {
			font-family: 'Instrument Sans', sans-serif;
			font-size: 1.8rem;
			line-height: 2rem;
			color: #5468ff;
		}
		.scroll-container {
			scroll-margin-top: 42rem;
		}
		.content-mobile {
			margin-top: 2rem;
		}
		/* Unique mobile styles not in global CSS */
		.content-mobile img {
        margin: 2rem auto;
    }
		.content-mobile iframe {
        margin: 2rem auto;
        max-width: 100%;
		}
	</style>
{:else}
	<div bind:this={element} class="scroll-container px-36">
		<ScrollProgress />
		<article class="mx-auto max-w-[750px] py-42 text-wrap">
			<div class="relative flex flex-row justify-between">
				<p class="sans-typo-detail mb-4">{formatDate(data.meta.date)}</p>
				<div class="mono-typo-nav flex flex-wrap justify-end gap-2 pl-4 text-right">
					/
					<a href="/pond" class="underline decoration-wavy hover:underline"> Home </a>
					<p>/ {data.meta.title}</p>
				</div>
			</div>
			<h1 class="mb-4 -ml-8">{data.meta.title}</h1>
			<h2>{data.meta.excerpt}</h2>
			<div class="content">
				{#if html}
					<p>{@html html}</p>
				{:else}
					<p>Loading post content...</p>
				{/if}
			</div>
			<hr class="bg-light mt-16 mb-4 h-px w-full" />
			<div class="flex flex-row justify-between">
				<div class="sans-typo-detail mb-8 flex flex-row gap-2">
					<p class="font-semibold">categories:</p>
					<div class="flex flex-wrap gap-x-2">
						{#each data.meta.tags as tag}
							<span>{tag}</span>
						{/each}
					</div>
				</div>
				<BackToTopButton {element} variant="minimal" />
			</div>
			<div class="mono-typo-nav flex flex-col gap-2">
				{#if data.previousPost || data.nextPost}
					<nav class="mt-4 flex items-center justify-between">
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
			font-family: 'Hedvig Letters Serif', serif;
			font-size: 3rem;
		}
		h2 {
			font-family: 'Instrument Sans', sans-serif;
			font-size: 1.8rem;
			color: #5468ff;
		}
		.scroll-container {
			scroll-margin-top: 42rem;
		}
		.content {
			margin-top: 2rem;
		}
		/* Unique desktop styles not in global CSS */
		.content img {
        margin: 5rem auto 2rem;
        max-width: 80%;
		}
		.content iframe {
        margin: 5rem auto;
        max-width: 100%;
		}
		.content figcaption {
			margin-bottom: 5rem;
		}
		.content h3 {
			margin-top: 5rem;
		}
	</style>
{/if}
