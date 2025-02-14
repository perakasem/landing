<script>
    import { onMount } from 'svelte';
    import { sideImage } from "$lib/stores/sideImageStore.js";
    import { attributionClass } from '$lib/stores/attributionStore';
    import ScrollProgress from "../../components/ScrollProgress.svelte";

    const mobileBreakpoint = 640;
    let isMobile = false;
    let scrolled = false;

    function updateViewport() {
        isMobile = window.innerWidth < mobileBreakpoint;
    }

    function handleScroll(event) {
        scrolled = event.currentTarget.scrollTop > 60;
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
    <div class="p-8 flex flex-col h-full overflow-y-auto" on:scroll={handleScroll}>
        <div class="absolute aspect-square w-12 transition-opacity duration-200" class:opacity-0={scrolled}>
            <a href="/" aria-label="Home">
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-45"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-90"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-135"></div>
            </a>
        </div>
        <div class="pt-12 mb-40 mt-20">
            <h1 class="sans-typo-title-small text-xl mb-1 text-wrap">Privacy Policy</h1>
            <p class="sans-typo-detail text-sm mb-8 text-wrap">Effective on February 12, 2025</p>
            <ol class="list-decimal pl-4 serif-typo-body-small">
                <li class="mb-4">
                    <p class="mb-2">Information Collection</p>
                    <p>This Site does not collect, store, or process any personal data.</p>
                </li>
                <li class="mb-4">
                    <p class="mb-2">Cookies & Tracking</p>
                    <p>This Site does not use cookies, analytics, or tracking technologies.</p>
                </li>
                <li class="mb-4">
                    <p class="mb-2">External Links</p>
                    <p>
                        If you follow links to third-party websites, their privacy policies apply,
                        and I am not responsible for their content or practices.
                    </p>
                </li>
                <li class="mb-4">
                    <p class="mb-2">Changes to This Policy</p>
                    <p>This Privacy Policy may be updated at any time. The latest version will always be available on this page.</p>
                </li>
                <li class="mb-4">
                    <p class="mb-2">Contact</p>
                    <p>For any inquiries, please reach out to me
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
    <div class="p-8 flex flex-col h-full overflow-y-auto" on:scroll={handleScroll}>
        <div class="absolute aspect-square w-16 transition-opacity duration-200" class:opacity-0={scrolled}>
            <a href="/" aria-label="Home">
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-45"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-90"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-135"></div>
            </a>
        </div>
        <div class="pt-40 flex flex-col items-center mb-40">
            <div class="max-w-140 flex flex-col">
                <h1 class="sans-typo-title">Privacy Policy</h1>
                <p class="sans-typo-detail">Effective on February 12, 2025</p>
                <ol class="list-decimal p-8 serif-typo-body text-wrap">
                    <li class="mb-4">
                        <p class="mb-2">Information Collection</p>
                        <p>This Site does not collect, store, or process any personal data.</p>
                    </li>
                    <li class="mb-4">
                        <p class="mb-2">Cookies & Tracking</p>
                        <p>This Site does not use cookies, analytics, or tracking technologies.</p>
                    </li>
                    <li class="mb-4">
                        <p class="mb-2">External Links</p>
                        <p>
                            If you follow links to third-party websites, their privacy policies apply,
                            and I am not responsible for their content or practices.
                        </p>
                    </li>
                    <li class="mb-4">
                        <p class="mb-2">Changes to This Policy</p>
                        <p>This Privacy Policy may be updated at any time. The latest version will always be available on this page.</p>
                    </li>
                    <li class="mb-4">
                        <p class="mb-2">Contact</p>
                        <p>For any inquiries, please reach out to me
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
