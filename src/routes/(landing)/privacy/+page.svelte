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

	attributionClass.set('attribution-typo');

	onMount(() => {
		sideImage.set('');
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
			<h1 class="sans-typo-title-small mb-1 text-xl text-wrap">Privacy Policy</h1>
			<p class="sans-typo-detail mb-8 text-sm text-wrap">Effective on February 12, 2025</p>
			<ol class="serif-typo-body-small list-decimal pl-4">
				<li class="mb-4">
					<p class="mb-2"><strong>Information Collection</strong></p>
					<p>This Site does not collect personal information such as names or contact details.
						However, for security, performance, and analytics purposes, certain technical data
						(such as IP address, browser type, device information, pages visited, and referrer data)
						may be processed automatically by hosting and analytics providers.</p>
				</li>
				<li class="mb-4">
					<p class="mb-2"><strong>Cookies & Tracking</strong></p>
					<p>This Site does not use cookies for advertising or user profiling.
						Privacy-focused, cookie-free analytics are used to understand aggregate site traffic and
						performance.</p>
				</li>
				<li class="mb-4">
					<p class="mb-2"><strong>Service Providers</strong></p>
					<p>Hosting and analytics partners may process anonymized or pseudonymized technical data as part
						of operating the Site. These include Vercel Analytics and Cloudflare Web Analytics and HTTP
						traffic logs. For details on how these providers handle data, please refer to their respective
						privacy policies.
					</p>
				</li>
				<li class="mb-4">
					<p class="mb-2"><strong>External Links</strong></p>
					<p>
						If you follow links to third-party websites, their privacy policies apply, and I am not
						responsible for their content or practices.
					</p>
				</li>
				<li class="mb-4">
					<p class="mb-2"><strong>Changes to This Policy</strong></p>
					<p>
						This Privacy Policy may be updated at any time. The latest version will always be
						available on this page.
					</p>
				</li>
				<li class="mb-4">
					<p class="mb-2"><strong>Contact</strong></p>
					<p>
						For any inquiries, please reach out
						<a href="mailto:pkasemsriptak+site@gmail.com" class="underline">via email</a>.
					</p>
				</li>
			</ol>
			<div class="flex justify-between">
				<a href="/" class="sans-typo-detail hover:underline">Home</a>
				<a href="/terms" class="sans-typo-detail hover:underline">Terms of Use</a>
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
				<h1 class="sans-typo-title">Privacy Policy</h1>
				<p class="sans-typo-detail">Effective on February 12, 2025</p>
				<ol class="serif-typo-body list-decimal p-8 text-wrap">
					<li class="mb-4">
						<p class="mb-2"><strong>Information Collection</strong></p>
						<p>This Site does not collect personal information such as names or contact details.
							However, for security, performance, and analytics purposes, certain technical data
							(such as IP address, browser type, device information, pages visited, and referrer data)
							may be processed automatically by hosting and analytics providers.</p>
					</li>
					<li class="mb-4">
						<p class="mb-2"><strong>Cookies & Tracking</strong></p>
						<p>This Site does not use cookies for advertising or user profiling.
							Privacy-focused, cookie-free analytics are used to understand aggregate site traffic and
							performance.</p>
					</li>
					<li class="mb-4">
						<p class="mb-2"><strong>Service Providers</strong></p>
						<p>Hosting and analytics partners may process anonymized or pseudonymized technical data as part
							of operating the Site. These include Vercel Analytics and Cloudflare Web Analytics and HTTP
							traffic logs. For details on how these providers handle data, please refer to their respective
							privacy policies.
						</p>
					</li>
					<li class="mb-4">
						<p class="mb-2"><strong>Changes to This Policy</strong></p>
						<p>
							This Privacy Policy may be updated at any time. The latest version will always be
							available on this page.
						</p>
					</li>
					<li class="mb-4">
						<p class="mb-2"><strong>Contact</strong></p>
						<p>
							For any inquiries, please reach out
							<a href="mailto:pkasemsriptak+site@gmail.com" class="underline">via email</a>.
						</p>
					</li>
				</ol>
				<div class="flex justify-between">
					<a href="/" class="sans-typo-detail hover:underline">Home</a>
					<a href="/terms" class="sans-typo-detail hover:underline">Terms of Use</a>
				</div>
			</div>
		</div>
	</div>
{/if}
