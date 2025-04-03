<script lang="ts">
    import AsteriskBig from "../../../components/AsteriskBig.svelte";
    import AsteriskSmall from "../../../components/AsteriskSmall.svelte";
    import { onMount, onDestroy } from "svelte";
    import { afterNavigate } from "$app/navigation";
    import { fade } from "svelte/transition";
    import { page } from '$app/state';
    import ThemeToggle from "../../../components/ThemeToggle.svelte";
    import ThemeManager from "../../../components/ThemeManager.svelte";

    const mobileBreakpoint = 640;
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
        window.addEventListener("resize", updateViewport);
    });

    onDestroy(() => {
        window.removeEventListener("resize", updateViewport);
    });

    const props = $props();
    const children = props.children;
</script>

<ThemeManager/>

{#if isMobile}
    <div bind:this={element} class="flex flex-col h-dvh">
        <div class="m-8 absolute aspect-square w-12 z-30 transition-opacity duration-200" class:opacity-0={scrolled}>
            <AsteriskSmall/>
        </div>
        <div bind:this={scrollableContainer} class="h-screen w-screen overflow-y-auto scroll-smooth" onscroll={handleScrollMobile}>
            {#key page.url.pathname}
                <div class="relative bg-dark min-h-screen transition-opacity mb-45 z-20" in:fade={{ duration: 500 }}>
                    {@render children()}
                </div>
            {/key}
            <footer class="h-45 w-screen bg-dark overflow-hidden absolute bottom-0">
                <section class="footer-container h-full w-screen bg-pond text-off-white flex flex-col justify-between">
                    <div class="px-8 pt-8 mb-4 flex flex-col">
                        <div class="flex flex-row mono-typo-nav">
                            <div class="absolute aspect-square w-16 transition-opacity duration-200">
                                <AsteriskSmall />
                            </div>
                            <div class="flex flex-row ml-24 w-full">
                                <div class="flex flex-col w-1/2 gap-2">
                                    <a href="/pond">Home</a>
                                    <a href="/pond/archive">Archive</a>
                                    <a href="/pond/dump">Dump</a>
                                </div>
                                <div class="flex flex-col w-1/2 gap-2">
                                    <a href="/privacy">Privacy</a>
                                    <a href="/terms">Terms</a>
                                    <a href="/rss.xml"
                                       target="_blank"
                                       rel="noopener noreferrer"
                                    >
                                        Subscribe
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-full flex flex-col">
                        <img src="/3s.png" class="mx-4" alt="pond logo" />
                    </div>
                </section>
            </footer>
        </div>
    </div>
{:else}
    <div class="flex flex-col h-full" bind:this={element}>
        <!-- Top asterisk: visible when at top (<=60) or scrolling up -->
        <div class="absolute m-8 aspect-square w-16 z-20 transition-opacity duration-300 ease-out" class:opacity-0={!showAsterisk}>
            <AsteriskBig />
        </div>
        <!-- Scrollable container -->
        <div bind:this={scrollableContainer} class="h-screen w-screen overflow-y-auto scroll-smooth" onscroll={handleScroll}>
            {#key page.url.pathname}
                <div class="relative dark:bg-dark bg-dark min-h-screen transition-opacity mb-80 z-10" in:fade={{ duration: 500 }}>
                    {@render children()}
                </div>
            {/key}
            <footer class="h-80 w-screen bg-dark overflow-hidden absolute bottom-0">
                <section class="footer-container h-80 w-screen bg-pond text-off-white flex flex-col">
                    <div class="p-8 h-full flex flex-row justify-between">
                        <div class="flex flex-row">
                            <div class="absolute aspect-square w-16 transition-opacity duration-200">
                                <AsteriskBig />
                            </div>
                            <div class="flex flex-col mono-typo-nav ml-24">
                                <a href="/pond" class="mb-2 hover:underline">Current Chapter</a>
                                <a href="/pond/archive" class="mb-2 hover:underline">Archive</a>
                                <a href="/pond/dump" class="mb-2 hover:underline">Dump</a>
                            </div>
                        </div>
                        <div class="mono-typo-nav text-right text-wrap">
                            <p class="ml-32">
                                &copy; {new Date().getFullYear()} Pera Kasemsripitak. All Rights Reserved. |
                                <a href="/privacy" class="hover:font-bold">Privacy Policy</a> |
                                <a href="/terms" class="hover:font-bold">Terms of Use</a> |
                                <a href="/rss.xml" class="hover:font-bold"
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
