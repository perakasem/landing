<script lang="ts">
    import AsteriskBig from "../../../components/AsteriskBig.svelte";
    import { onMount, onDestroy } from "svelte";
    import AsteriskSmall from "../../../components/AsteriskSmall.svelte";
    import {afterNavigate} from "$app/navigation";

    const mobileBreakpoint = 640;
    let isMobile = false;
    let showAsterisk = true;
    let lastScrollY = 0;
    let scrollableContainer: HTMLElement;

    let element: any;

    function updateViewport() {
        isMobile = window.innerWidth < mobileBreakpoint;
    }

    afterNavigate(() => {
        element.scrollIntoView();
    })

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

    onMount(() => {
        updateViewport();
        window.addEventListener("resize", updateViewport);
    });

    onDestroy(() => {
        window.removeEventListener("resize", updateViewport);
    });
</script>

{#if isMobile}
    <div class="absolute aspect-square w-12 transition-opacity duration-200">
        <AsteriskSmall/>
    </div>
{:else}
    <div class="flex flex-col h-full" bind:this={element}>
        <!-- Top asterisk: visible when at top (<=60) or scrolling up -->
        <div class="absolute m-8 aspect-square w-16 z-20 transition-opacity duration-300 ease-out" class:opacity-0={!showAsterisk}>
            <AsteriskBig />
        </div>
        <!-- Scrollable container -->
        <div bind:this={scrollableContainer} class="h-screen w-screen overflow-y-auto scroll-smooth" on:scroll={handleScroll}>
            <div class="relative bg-dark min-h-screen">
                <slot />
            </div>
            <footer class="h-80 w-screen bg-dark overflow-hidden relative z-20">
                <section class="footer-container h-80 w-screen bg-pond text-off-white flex flex-col">
                    <div class="p-8 h-full flex flex-row justify-between">
                        <div class="flex flex-row">
                            <div class="absolute aspect-square w-16 transition-opacity duration-200">
                                <AsteriskBig />
                            </div>
                            <div class="flex flex-col mono-typo-nav ml-24">
                                <a href="/pond" class="mb-2 hover:underline">Current Chapter</a>
                                <a href="/(pond)/pond/archive" class="mb-2 hover:underline">Archive</a>
                                <a href="/(pond)/pond/dump" class="mb-2 hover:underline">Dump</a>
                            </div>
                        </div>
                        <div class="mono-typo-nav">
                            <p>
                                © 2025 Pera Kasemsripitak. All Rights Reserved. |
                                <a href="/privacy" class="hover:font-bold">Privacy Policy</a> |
                                <a href="/terms" class="hover:font-bold">Terms of Use</a> |
                                <a href="/rss.xml" class="hover:font-bold">Subscribe</a>
                            </p>
                        </div>
                    </div>
                    <img src="/pond.png" alt="pond logo" />
                </section>
            </footer>
        </div>
    </div>
{/if}
