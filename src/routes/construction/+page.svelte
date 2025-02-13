<script>
    import { onMount } from 'svelte';
    import { sideImage } from "$lib/stores/sideImageStore.js";
    import { attributionClass } from '$lib/stores/attributionStore';

    const mobileBreakpoint = 640;
    let isMobile = false;

    function updateViewport() {
        isMobile = window.innerWidth < mobileBreakpoint;
    }

    attributionClass.set('attribution-typo');

    onMount(() => {
        sideImage.set('construction.jpg');
        updateViewport();
        window.addEventListener('resize', updateViewport);
        return () => window.removeEventListener('resize', updateViewport);

    });
</script>

{#if isMobile}
    <div class="p-8 flex flex-col h-full overflow-y-auto">
        <div class="absolute aspect-square w-12 transition-opacity duration-200">
            <a href="/" aria-label="Home">
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-45"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-90"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-135"></div>
            </a>
        </div>
        <div class="pt-12 mb-40 mt-20">
            <h1 class="sans-typo-title-small text-xl mb-1 text-wrap">Under Construction</h1>
            <p class="p-4 serif-typo-body-small text-wrap">
                Still cooking this page up. It's gotta be perfect, yfm? Type shiiiii. Come back soon!
            </p>
            <a href="/" class="sans-typo-detail hover:underline">Home</a>
        </div>
    </div>
{:else}
    <div class="p-8 flex flex-col h-full overflow-y-auto">
        <div class="absolute aspect-square w-16 transition-opacity duration-200">
            <a href="/" aria-label="Home">
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-45"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-90"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-135"></div>
            </a>
        </div>
        <div class="pt-40 flex flex-col items-center mb-40">
            <div class="max-w-140 flex flex-col">
                <h1 class="sans-typo-title-small text-xl mb-1 text-wrap">Under Construction</h1>
                <p class="p-4 serif-typo-body text-wrap">
                    Still cooking this page up. It's gotta be perfect, yfm? Type shiiiii. Come back soon!
                </p>
                <a href="/" class="sans-typo-detail hover:underline">Home</a>
            </div>
        </div>
    </div>
{/if}
