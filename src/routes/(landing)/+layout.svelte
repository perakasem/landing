<script lang="ts">
	import '../../app.css';
	import '../../tailwind.css';
	import { fade } from 'svelte/transition';
	import { sideImage } from '$lib/stores/sideImageStore.js';
	import { attributionClass } from '$lib/stores/attributionStore.js';
	import { page } from '$app/state';

	const props = $props();
	const scrollable = props.scrollable ?? false;
	const children = props.children;
</script>

<div class="flex h-screen min-h-screen w-screen overflow-hidden">
	<div
		class="h-screen min-h-screen w-2/3 class:overflow-y-auto={scrollable} class:overflow-hidden={!scrollable}"
	>
		{#key page.url.pathname}
			<div class="relative h-full w-full" in:fade={{ duration: 500 }}>
				{@render children()}
			</div>
		{/key}
	</div>
	<div class="w-1/3 overflow-hidden">
		{#if $sideImage}
			<img src={$sideImage} alt="background" class="h-full w-full object-cover" />
		{/if}
	</div>

	<div class="pointer-events-none fixed inset-y-0 right-0 w-8">
		<div class="h-full w-full backdrop-blur-md"></div>
	</div>

	<div class="fixed right-2 bottom-0 origin-top-right rotate-90 {$attributionClass}">
		<p>
			&copy; {new Date().getFullYear()} Pera Kasemsripitak. All Rights Reserved. |
			<a href="/privacy" class="transition hover:font-semibold">Privacy Policy</a> |
			<a href="/terms" class="transition hover:font-semibold">Terms of Use</a> |
			<a href="/construction" class="transition hover:font-semibold">Archive</a>
		</p>
	</div>
</div>
