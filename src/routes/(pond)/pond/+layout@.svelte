<script lang="ts">
	import AsteriskBig from '../../../components/AsteriskBig.svelte';
	import AsteriskSmall from '../../../components/AsteriskSmall.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';

	const mobileBreakpoint = 700;
	let lastScrollY = 0;
	let isMobile = $state(false);
	let showAsterisk = $state(true);
	let scrolled = $state(false);
	let scrollableContainer: HTMLElement | null = $state(null);
	let element: HTMLElement | null = $state(null);

	function updateViewport() {
		isMobile = window.innerWidth < mobileBreakpoint;
	}

	afterNavigate(() => {
		element!.scrollIntoView();
	});

	function handleScroll(event: Event) {
		const target = event.currentTarget as HTMLElement;
		const currentScrollY = target.scrollTop;
		if (currentScrollY <= 60) {
			// Always show when near the top
			showAsterisk = true;
		} else if (currentScrollY < lastScrollY) {
			// Scrolling up past 60px: show
			showAsterisk = true;
		} else if (currentScrollY > lastScrollY) {
			// Scrolling down past 60px: hide
			showAsterisk = false;
		}
		lastScrollY = currentScrollY;
	}
	function handleScrollMobile(event: Event) {
		const target = event.currentTarget as HTMLElement | null;
		if (!target) return;

		scrolled = target.scrollTop > 60;
	}

	onMount(() => {
		updateViewport();
		window.addEventListener('resize', updateViewport);
	});

	onDestroy(() => {
		window.removeEventListener('resize', updateViewport);
	});

	const props = $props();
	const children = props.children;
</script>

{#if isMobile}
	<div bind:this={element} class="flex h-dvh flex-col">
		<div
			class="absolute z-30 m-8 aspect-square w-12 transition-opacity duration-200"
			class:opacity-0={scrolled}
		>
			<AsteriskSmall />
		</div>
		<div
			bind:this={scrollableContainer}
			class="h-screen w-screen overflow-y-auto scroll-smooth"
			onscroll={handleScrollMobile}
		>
			{#key page.url.pathname}
				<div class="bg-dark relative z-20 mb-45 min-h-screen transition-opacity">
					{@render children()}
				</div>
			{/key}
			<footer class="bg-dark absolute bottom-0 h-45 w-screen overflow-hidden">
				<section
					class="footer-container bg-pond text-off-white flex h-full w-screen flex-col justify-between"
				>
					<div class="mb-4 flex flex-col px-8 pt-8">
						<div class="mono-typo-nav flex flex-row">
							<div class="absolute aspect-square w-16 transition-opacity duration-200">
								<AsteriskSmall />
							</div>
							<div class="ml-24 flex w-full flex-row">
								<div class="flex w-1/2 flex-col gap-2">
									<a href="/pond">Latest</a>
									<a href="/pond/archive">Archive</a>
									<a href="/">Home</a>
								</div>
								<div class="flex w-1/2 flex-col gap-2">
									<a href="/privacy">Privacy</a>
									<a href="/terms">Terms</a>
									<a href="/rss.xml" target="_blank" rel="noopener noreferrer"> Subscribe </a>
								</div>
							</div>
						</div>
					</div>
					<div class="flex w-full flex-col">
						<img src="/3s.png" class="mx-4" alt="pond logo" />
					</div>
				</section>
			</footer>
		</div>
	</div>
{:else}
	<div class="flex h-full flex-col" bind:this={element}>
		<!-- Top asterisk: visible when at top (<=60) or scrolling up -->
		<div
			class="absolute z-20 m-8 aspect-square w-16 transition-opacity duration-300 ease-out"
			class:opacity-0={!showAsterisk}
		>
			<AsteriskBig />
		</div>
		<!-- Scrollable container -->
		<div
			bind:this={scrollableContainer}
			class="h-screen w-screen overflow-y-auto scroll-smooth"
			onscroll={handleScroll}
		>
			{#key page.url.pathname}
				<div class="dark:bg-dark bg-dark relative z-10 mb-80 min-h-screen transition-opacity">
					{@render children()}
				</div>
			{/key}
			<footer class="bg-dark absolute bottom-0 h-80 w-screen overflow-hidden">
				<section class="footer-container bg-pond text-off-white flex h-80 w-screen flex-col">
					<div class="flex h-full flex-row justify-between p-8">
						<div class="flex flex-row">
							<div class="absolute aspect-square w-16 transition-opacity duration-200">
								<AsteriskBig />
							</div>
							<div class="mono-typo-nav ml-24 flex flex-col">
								<a href="/pond" class="mb-2 hover:underline">Current Chapter</a>
								<a href="/pond/archive" class="mb-2 hover:underline">Archive</a>
								<a href="/" class="mb-2 hover:underline">Home</a>
							</div>
						</div>
						<div class="mono-typo-nav text-right text-wrap">
							<p class="ml-32">
								&copy; {new Date().getFullYear()} Pera Kasemsripitak. |
								<a href="/privacy" class="hover:font-bold">Privacy Policy</a> |
								<a href="/terms" class="hover:font-bold">Terms of Use</a> |
								<a href="https://cms.perakasem.com" target="_blank" class="hover:font-bold">Admin</a> |
								<a
									href="/rss.xml"
									class="hover:font-bold"
									target="_blank"
									rel="noopener noreferrer"
								>
									Subscribe
								</a>
							</p>
						</div>
					</div>
					<img src="/3s.png" alt="pond logo" />
				</section>
			</footer>
		</div>
	</div>
{/if}
