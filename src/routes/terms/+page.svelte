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

    // Set a default attribution class
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
        <!-- Home icon with fading opacity when scrolled -->
        <div class="absolute aspect-square w-12 transition-opacity duration-200" class:opacity-0={scrolled}>
            <a href="/" aria-label="Home">
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-45"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-90"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-135"></div>
            </a>
        </div>
        <!-- Terms of Service content for mobile -->
        <div class="pt-12 mb-40 mt-20">
            <h1 class="sans-typo-title-small text-xl mb-1 text-wrap">Terms of Service</h1>
            <p class="sans-typo-detail text-sm mb-8 text-wrap">Effective on February 13, 2025</p>
            <ol class="list-decimal pl-4 serif-typo-body-small">
                <li class="mb-4">
                    <p class="mb-2"><strong>Acceptance of Terms</strong></p>
                    <p>
                        You may only use this website if you accept these Terms of Use. By accessing and using this website, you acknowledge and accept to be bound by these Terms of Use.
                    </p>
                </li>
                <li class="mb-4">
                    <p class="mb-2"><strong>Purpose of the Site</strong></p>
                    <p>
                        I am providing this site solely for informational and portfolio purposes, to showcase my personal work, projects, and creative content. It is not intended to constitute a professional service, contract, or offer of employment.
                    </p>
                </li>
                <li class="mb-4">
                    <p class="mb-2"><strong>Intellectual Property</strong></p>
                    <p>
                        All content on this Site, including text, images, graphics, and design, is owned by or licensed to me (Pera Kasemsripitak), except where explicitly noted otherwise. You may not copy, distribute, or reproduce any content without permission.
                    </p>
                </li>
                <li class="mb-4">
                    <p class="mb-2"><strong>Use of the Site</strong></p>
                    <p>
                        This website is provided solely for informational and portfolio purposes. Its contents are intended to showcase personal work and should not be used in connection with any activities that are unlawful or that may disrupt its proper functioning. Visitors are respectfully requested to adhere to its intended use.                    </p>
                </li>
                <li class="mb-4">
                    <p class="mb-2"><strong>Disclaimer</strong></p>
                    <p>
                        This Site is provided "as is" without warranties of any kind, including but not limited to the accuracy or completeness of the content. I am not responsible for any errors, downtime, or damages including any loss of data or profits resulting from the use of this Site.
                    </p>
                </li>
                <li class="mb-4">
                    <p class="mb-2"><strong>External Links</strong></p>
                    <p>
                        This Site may include links to third-party websites. I am not responsible for the content or policies of external sites.
                    </p>
                </li>
                <li class="mb-4">
                    <p class="mb-2"><strong>Changes to These Terms</strong></p>
                    <p>
                        I reserve the right to modify these Terms of Use at any time without prior notice. The latest version will always be available on this page and it is your responsibility to review these terms periodically for any changes.
                    </p>
                </li>
            </ol>
            <a href="/" class="sans-typo-detail hover:underline">Home</a>
        </div>
    </div>
{:else}
    <ScrollProgress />
    <div class="p-8 flex flex-col h-full overflow-y-auto" on:scroll={handleScroll}>
        <!-- Home icon with fading opacity when scrolled -->
        <div class="absolute aspect-square w-16 transition-opacity duration-200" class:opacity-0={scrolled}>
            <a href="/" aria-label="Home">
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-45"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-90"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-135"></div>
            </a>
        </div>
        <!-- Terms of Service content for desktop -->
        <div class="pt-40 flex flex-col items-center mb-40">
            <div class="max-w-140 flex flex-col">
                <h1 class="sans-typo-title">Terms of Use</h1>
                <p class="sans-typo-detail">Effective on February 13, 2025</p>
                <ol class="list-decimal p-8 serif-typo-body text-wrap">
                    <li class="mb-4">
                        <p class="mb-2"><strong>Acceptance of Terms</strong></p>
                        <p>
                            You may only use this website if you accept these Terms of Use. By accessing and using this website, you acknowledge and accept to be bound by these Terms of Use.
                        </p>
                    </li>
                    <li class="mb-4">
                        <p class="mb-2"><strong>Purpose of the Site</strong></p>
                        <p>
                            I am providing this site solely for informational and portfolio purposes, to showcase my personal work, projects, and creative content. It is not intended to constitute a professional service, contract, or offer of employment.
                        </p>
                    </li>
                    <li class="mb-4">
                        <p class="mb-2"><strong>Intellectual Property</strong></p>
                        <p>
                            All content on this Site, including text, images, graphics, and design, is owned by or licensed to me (Pera Kasemsripitak), except where explicitly noted otherwise. You may not copy, distribute, or reproduce any content without permission.
                        </p>
                    </li>
                    <li class="mb-4">
                        <p class="mb-2"><strong>Use of the Site</strong></p>
                        <p>
                            This website is provided solely for informational and portfolio purposes. Its contents are intended to showcase personal work and should not be used in connection with any activities that are unlawful or that may disrupt its proper functioning. Visitors are respectfully requested to adhere to its intended use.                    </p>
                    </li>
                    <li class="mb-4">
                        <p class="mb-2"><strong>Disclaimer</strong></p>
                        <p>
                            This Site is provided "as is" without warranties of any kind, including but not limited to the accuracy or completeness of the content. I am not responsible for any errors, downtime, or damages including any loss of data or profits resulting from the use of this Site.
                        </p>
                    </li>
                    <li class="mb-4">
                        <p class="mb-2"><strong>External Links</strong></p>
                        <p>
                            This Site may include links to third-party websites. I am not responsible for the content or policies of external sites.
                        </p>
                    </li>
                    <li class="mb-4">
                        <p class="mb-2"><strong>Changes to These Terms</strong></p>
                        <p>
                            I reserve the right to modify these Terms of Use at any time without prior notice. The latest version will always be available on this page and it is your responsibility to review these terms periodically for any changes.
                        </p>
                    </li>
                </ol>
                <div class="flex justify-between">
                    <a href="/" class="sans-typo-detail hover:underline">Home</a>
                    <a href="/privacy" class="sans-typo-detail hover:underline">Privacy Policy</a>
                </div>
            </div>
        </div>
    </div>
{/if}
