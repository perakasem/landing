<script lang="ts">
	import { onMount } from 'svelte';
	import { sideImage } from '$lib/stores/sideImageStore';
	import { attributionClass } from '$lib/stores/attributionStore';
	import BigAsterisk from '../../../components/AsteriskBig.svelte';
	import SmallAsterisk from '../../../components/AsteriskSmall.svelte';
	import AsteriskBig from '../../../components/AsteriskBig.svelte';
	import AsteriskSmall from '../../../components/AsteriskSmall.svelte';

	const mobileBreakpoint = 640;
	let isMobile = false;

	function updateViewport() {
		isMobile = window.innerWidth < mobileBreakpoint;
	}

	attributionClass.set('attribution-typo');

	onMount(() => {
		sideImage.set('/construction.jpg');
		updateViewport();
		window.addEventListener('resize', updateViewport);
		return () => window.removeEventListener('resize', updateViewport);
	});
</script>

{#if isMobile}
	<div class="flex h-full flex-col overflow-y-auto p-8">
		<div class="absolute aspect-square w-12 transition-opacity duration-200">
			<AsteriskSmall />
		</div>
		<div class="mt-20 mb-40 pt-12">
			<h1 class="sans-typo-title-small mb-1 text-xl text-wrap">Under Construction</h1>
			<p class="serif-typo-body-small p-4 text-wrap">
				Still cooking this page up. It's gotta be perfect, yfm? Type shiiiii. Come back soon!
			</p>
			<a href="/" class="sans-typo-detail hover:underline">Home</a>
		</div>
	</div>
{:else}
	<div class="flex h-full flex-col overflow-y-auto p-8">
		<div class="absolute aspect-square w-16 transition-opacity duration-200">
			<AsteriskBig />
		</div>
		<div class="mb-40 flex flex-col items-center pt-40">
			<div class="flex max-w-140 flex-col">
				<h1 class="sans-typo-title-small mb-1 text-xl text-wrap">Under Construction</h1>
				<p class="serif-typo-body p-4 text-wrap">
					Still cooking this page up. It's gotta be perfect, yfm? Type shiiiii. Come back soon!
				</p>
				<a href="/" class="sans-typo-detail hover:underline">Home</a>
			</div>
		</div>
	</div>
{/if}
