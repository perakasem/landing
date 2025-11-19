<script lang="ts">
	/**
	 * Content Renderer Component
	 * Renders structured content blocks from CMS
	 * Supports different layouts for mobile/desktop
	 */
	import type { ContentBlock } from '$lib/types/database';

	let {
		blocks,
		isMobile = false
	}: {
		blocks: ContentBlock[];
		isMobile?: boolean;
	} = $props();
</script>

{#each blocks as block}
	{#if block.type === 'text'}
		<p class={block.className || 'serif-typo-body'}>
			{block.content}
		</p>
	{:else if block.type === 'heading'}
		{#if block.level === 1}
			<h1 class={block.className || 'serif-typo-h1'}>{block.content}</h1>
		{:else if block.level === 2}
			<h2 class={block.className || 'serif-typo-title'}>{block.content}</h2>
		{:else if block.level === 3}
			<h3 class={block.className}>{block.content}</h3>
		{:else if block.level === 4}
			<h4 class={block.className}>{block.content}</h4>
		{:else if block.level === 5}
			<h5 class={block.className}>{block.content}</h5>
		{:else}
			<h6 class={block.className}>{block.content}</h6>
		{/if}
	{:else if block.type === 'image'}
		<figure class={block.className}>
			<img src={block.src} alt={block.alt} />
			{#if block.caption}
				<figcaption class="sans-typo-detail">{block.caption}</figcaption>
			{/if}
		</figure>
	{:else if block.type === 'button'}
		<a
			href={block.href}
			class={block.variant === 'primary'
				? 'button-primary'
				: block.className || 'button-secondary-compact'}
		>
			{block.label}
		</a>
	{:else if block.type === 'html'}
		{@html block.content}
	{:else if block.type === 'grid'}
		<div
			class={block.className || 'grid'}
			style={`grid-template-columns: repeat(${block.columns}, 1fr);`}
		>
			{#each block.items as item}
				<div>
					<svelte:self blocks={[item]} {isMobile} />
				</div>
			{/each}
		</div>
	{:else if block.type === 'component'}
		<!-- Custom component rendering -->
		{#if block.componentName === 'TechStacks'}
			{@const TechStacks = await import('./TechStacks.svelte')}
			<TechStacks.default {...block.props as any} />
		{/if}
	{/if}
{/each}

<style>
	.grid {
		display: grid;
		gap: 1rem;
		margin: 2rem 0;
	}

	figure {
		margin: 2rem 0;
	}

	img {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
	}

	figcaption {
		margin-top: 0.5rem;
		text-align: center;
		opacity: 0.8;
	}
</style>
