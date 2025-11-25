<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	export let data;

	// Fallback config in case data.config is undefined
	const DEFAULT_CONFIG = {
		title: '3rd Space',
		description: 'A bootleg substack of thoughts and things worth sharing.',
		currentChapter: "'25",
		url: 'https://perakasem.com/pond',
		watchUrl: 'https://youtu.be/Q0_W4SWHeWY?si=02AWC2EJLwpe1Owx',
		watch: 'The Future of Creativity',
		watchSource: 'Hank Green',
		mediaUrl: 'https://youtu.be/E8pHAQc4rxA?si=L_0o_9hUGHUmTZut',
		media: 'MF DOOM X Tatsuro Yamashita',
		mediaSource: 'Tanda',
		readUrl: 'https://situational-awareness.ai/',
		read: 'Situational Awareness',
		readSource: 'Leopold Aschenbrenner',
		artworkSrc: '/blank.jpg',
		artwork: 'Tomato Water',
		artist: 'OC'
	};

	$: config = data.config || DEFAULT_CONFIG;
	let activeSection: string | null = 'about';

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
			return '∨';
		}
		return '>';
	}

	function arrowStyleFor(key: string) {
		if (activeSection === key) {
			return 'sans-typo-detail';
		}
		return 'mono-type-nav font-normal';
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
	});
</script>

{#if isMobile}
	<div class="flex h-full flex-col overflow-y-auto">
		<div class="mt-20 mb-40 pt-12">
			<div class="flex w-full flex-col p-8">
				<div>
					<h1 class="sans-typo">
						{config.title}
					</h1>
					<p class="serif-typo-body my-4 text-wrap">
						{config.description}
					</p>
					<div class="mono-typo-nav my-8 flex flex-row flex-wrap gap-3">
						<a
							href="#entries"
							class="text-pond-blue rounded-2xl border-2 px-3 py-1 text-center font-bold"
							on:click|preventDefault={scrollIntoView}
						>
							Entries &gt
						</a>
						<a href="/pond/archive" class="rounded-2xl border px-3 py-1 text-center">Archive &gt</a>
					</div>
					<button
						on:click|preventDefault={() => toggleSection('rotation')}
						class="mono-typo-nav {activeSection === 'rotation'}"
					>
						In Rotation <span class={arrowStyleFor('rotation')}>{arrowFor('rotation')}</span>
					</button>
					{#if activeSection === 'rotation'}
						<div transition:slide class="mono-typo-nav flex max-w-70 flex-col text-wrap">
							<div class="my-4 flex flex-col gap-4 border-l-2 pl-4">
								<a
									href={config.watchUrl}
									class="text-pond-hover"
									target="_blank"
									rel="noopener noreferrer"
								>
									<p class="mb-1">{config.watch}</p>
									<p class="mb-2 font-bold">{config.watchSource}</p>
								</a>
								<a
									href={config.mediaUrl}
									class="text-pond-hover"
									target="_blank"
									rel="noopener noreferrer"
								>
									<p class="mb-1">{config.media}</p>
									<p class="mb-2 font-bold">{config.mediaSource}</p>
								</a>
								<a
									href={config.readUrl}
									class="text-pond-hover"
									target="_blank"
									rel="noopener noreferrer"
								>
									<p class="mb-1">{config.read}</p>
									<p class="mb-2 font-bold">{config.readSource}</p>
								</a>
							</div>
						</div>
					{/if}
				</div>
			</div>
			<img src={config.artworkSrc} alt="artwork" class="max-h-130 w-full object-cover pt-4" />
			<p class="mono-typo-nav-mobile w-full p-4 text-right">{config.artwork}, {config.artist}</p>
			<div class="flex flex-col p-8" id="entries">
				<div class="flex flex-col">
					<p class="text-pond-blue sans-typo-title-thin-mobile">Latest</p>
					{#if data.posts.filter((post) => post.form === 'longform' && post.chapter === config.currentChapter).length === 0}
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
					<p class="text-pond-blue sans-typo-title-thin-mobile mt-8">Shortform</p>
					{#if data.posts.filter((post) => post.form === 'shortform' && post.chapter === config.currentChapter).length === 0}
						<a href={`/pond/archive`}>
							<div class="text-pond-hover flex flex-col">
								<h2 class="serif-typo-h1-mobile text-wrap">Nothing to See Here</h2>
								<p class="sans-typo-title-thin-mobile text-wrap">View All Entries</p>
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
		<div class="flex h-full w-1/2 flex-grow flex-col">
			<div class="my-42 flex justify-center">
				<div
					class="sticky top-42 ml-8 flex w-30 flex-shrink-0 flex-col self-start text-wrap xl:ml-32 xl:w-1/5"
				>
					<div class="flex w-full flex-col">
						<div>
							<div class="mono-typo-nav-large mb-4 flex flex-col flex-wrap items-start gap-2">
								<button
									on:click|preventDefault={() => toggleSection('about')}
									class="text-pond-hover text-left uppercase {activeSection === 'about'}"
								>
									{config.title}
								</button>
								{#if activeSection === 'about'}
									<div transition:slide class="sans-typo-detail flex max-w-70 flex-col text-wrap">
										<div class="my-1 flex flex-col gap-2 border-l-1 pl-4">
											<div>
												<p class="break-words">{config.description}</p>
											</div>
										</div>
									</div>
								{/if}
								<button
									on:click|preventDefault={() => toggleSection('rotation')}
									class="text-pond-hover {activeSection === 'rotation'}"
								>
									Rotation
								</button>
								{#if activeSection === 'rotation'}
									<div transition:slide class="sans-typo-detail flex max-w-70 flex-col text-wrap">
										<div class="my-1 flex flex-col gap-2 border-l-1 pl-4">
											<a
												href={config.watchUrl}
												class="text-pond-hover"
												target="_blank"
												rel="noopener noreferrer"
											>
												<p class="">{config.watch}</p>
												<p class="font-semibold">{config.watchSource}</p>
											</a>
											<a
												href={config.mediaUrl}
												class="text-pond-hover"
												target="_blank"
												rel="noopener noreferrer"
											>
												<p class="">{config.media}</p>
												<p class="font-semibold">{config.mediaSource}</p>
											</a>
											<a
												href={config.readUrl}
												class="text-pond-hover"
												target="_blank"
												rel="noopener noreferrer"
											>
												<p class="">{config.read}</p>
												<p class="font-semibold">{config.readSource}</p>
											</a>
										</div>
									</div>
								{/if}
								<button
									on:click|preventDefault={() => toggleSection('artwork')}
									class="text-pond-hover {activeSection === 'artwork'}"
								>
									Featured
								</button>
								{#if activeSection === 'artwork'}
									<div transition:slide class="sans-typo-detail flex max-w-70 flex-col text-wrap">
										<div class="my-1 flex flex-col gap-2 border-l-1 pl-4">
											<div>
												<p class="">{config.artwork}</p>
												<p class="font-semibold">{config.artist}</p>
											</div>
										</div>
									</div>
								{/if}
								<a href="/pond/archive" class="text-pond-hover mr-4 decoration-wavy hover:underline"
									>Archive</a
								>
								<a
									href="/rss.xml"
									class="text-pond-hover mr-4 decoration-wavy hover:underline"
									target="_blank"
									rel="noopener noreferrer"
								>
									Subscribe
								</a>
							</div>
						</div>
					</div>
				</div>
				<div class="flex w-10 max-w-15 min-w-0 xl:flex-grow"></div>
				<div class="flex w-3/5 max-w-90 flex-shrink-0 flex-col pr-8 pl-4 xl:mr-24">
					<div class="flex flex-col">
						<p class="text-pond-blue sans-typo">Latest</p>
						{#if data.posts.filter((post) => post.form === 'longform' && post.chapter === config.currentChapter).length === 0}
							<a href={`/pond/archive`}>
								<div class="text-pond-hover flex flex-col">
									<h2 class="serif-typo-h1 text-wrap">Nothing to See Here</h2>
									<p class="sans-typo-title-thin text-wrap">View All Entries</p>
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
						<p class="text-pond-blue sans-typo mt-16">Shortform</p>
						{#if data.posts.filter((post) => post.form === 'shortform' && post.chapter === config.currentChapter).length === 0}
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
				<div class="min-w-0 flex-grow"></div>
			</div>
		</div>
		<div class="sticky top-0 right-0 z-20 h-screen w-1/2 self-start">
			<img src={config.artworkSrc} alt="artwork" class="h-full min-w-full object-cover" />
		</div>
	</div>
{/if}
