<script lang="ts">
	import { onMount } from 'svelte';
	import { sideImage } from '$lib/stores/sideImageStore';
	import { attributionClass } from '$lib/stores/attributionStore';
	import ScrollProgress from '../../../components/ScrollProgress.svelte';
	import AsteriskBig from '../../../components/AsteriskBig.svelte';
	import AsteriskSmall from '../../../components/AsteriskSmall.svelte';

	const mobileBreakpoint = 640;
	let isMobile = false;
	let scrolled = false;

	function updateViewport() {
		isMobile = window.innerWidth < mobileBreakpoint;
	}

	function handleScroll(event: Event) {
		const target = event.currentTarget as HTMLElement | null;
		if (!target) return;

		scrolled = target.scrollTop > 60;
	}

	attributionClass.set('attribution-typo-dark');

	onMount(() => {
		sideImage.set('/construction.jpg');
		updateViewport();
		window.addEventListener('resize', updateViewport);
		return () => window.removeEventListener('resize', updateViewport);
	});

	export const load = () => {
		return {
			scrollable: true
		};
	};
</script>

{#if isMobile}
	<ScrollProgress />
	<div class="flex h-full flex-col overflow-y-auto p-8" on:scroll={handleScroll}>
		<div
			class="absolute aspect-square w-12 transition-opacity duration-200"
			class:opacity-0={scrolled}
		>
			<AsteriskSmall />
		</div>
		<div class="mt-20 mb-40 pt-12">
			<p class="serif-typo-body-small mb-4 text-wrap">Under Construction</p>
			<hr class="bg-light mt-12 mb-8 h-px" />
			<p class="serif-typo-body-small py-2 text-wrap">Updated on 24/02/2025</p>
			<p class="serif-typo-body-small py-2 text-wrap">
				Inspired by
				<a
					href="https://sive.rs/nowff"
					class="underline decoration-wavy hover:text-stone-100"
					target="_blank"
					rel="noopener noreferrer"
				>
					Derek Sivers
				</a>
				and
				<a
					href="https://nownownow.com"
					class="underline decoration-wavy hover:text-stone-100"
					target="_blank"
					rel="noopener noreferrer"
				>
					nownownow
				</a>
			</p>
			<hr class="bg-light my-12 h-px" />
			<div class="flex justify-between">
				<a href="/" class="sans-typo-detail hover:underline">Home</a>
				<a href="/bio" class="sans-typo-detail hover:underline">Bio</a>
			</div>
		</div>
	</div>
{:else}
	<ScrollProgress />
	<div class="flex h-full flex-col overflow-y-auto p-8" on:scroll={handleScroll}>
		<div
			class="absolute aspect-square w-16 transition-opacity duration-200"
			class:opacity-0={scrolled}
		>
			<AsteriskBig />
		</div>
		<div class="mb-40 flex flex-col items-center pt-40">
			<div class="flex max-w-140 flex-col">
				<p class="serif-typo mb-4 text-wrap">Under Construction</p>
				<hr class="bg-light mt-12 mb-8 h-px" />
				<p class="serif-typo-paragraph py-2 text-wrap">Updated on 24/02/2025</p>
				<p class="serif-typo-paragraph py-2 text-wrap">
					Inspired by
					<a
						href="https://sive.rs/nowff"
						class="underline decoration-wavy hover:text-stone-100"
						target="_blank"
						rel="noopener noreferrer"
					>
						Derek Sivers
					</a>
					and
					<a
						href="https://nownownow.com"
						class="underline decoration-wavy hover:text-stone-100"
						target="_blank"
						rel="noopener noreferrer"
					>
						nownownow
					</a>
				</p>
				<hr class="bg-light mt-8 mb-12 h-px" />
				<div class="flex justify-between">
					<a href="/" class="sans-typo-detail hover:underline">Home</a>
					<a href="/bio" class="sans-typo-detail hover:underline">Bio</a>
				</div>
			</div>
		</div>
	</div>
{/if}
