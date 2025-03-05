<script lang="ts">
    import { onMount } from 'svelte';
    import { sideImage } from '$lib/stores/sideImageStore';
    import { attributionClass } from '$lib/stores/attributionStore';
    import ScrollProgress from "../../../components/ScrollProgress.svelte";
    import AsteriskBig from "../../../components/AsteriskBig.svelte";
    import AsteriskSmall from "../../../components/AsteriskSmall.svelte";

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
    <div class="p-8 flex flex-col h-full overflow-y-auto" on:scroll={handleScroll}>
        <div class="absolute aspect-square w-12 transition-opacity duration-200" class:opacity-0={scrolled}>
            <AsteriskSmall/>
        </div>
        <div class="pt-12 mb-40 mt-20">
            <p class="serif-typo-body-small text-wrap mb-4">
                Under Construction
            </p>
            <hr class="h-px mt-12 mb-8 bg-light">
            <p class="py-2 serif-typo-body-small text-wrap">
                Updated on 24/02/2025
            </p>
            <p class="py-2 serif-typo-body-small text-wrap">
                Inspired by
                <a href="https://sive.rs/nowff" class="underline decoration-wavy hover:text-stone-100"
                   target=_blank
                   rel="noopener noreferrer">
                    Derek Sivers
                </a>
                and
                <a href="https://nownownow.com" class="underline decoration-wavy hover:text-stone-100"
                   target=_blank
                   rel="noopener noreferrer">
                    nownownow
                </a>
            </p>
            <hr class="h-px my-12 bg-light">
            <div class="flex justify-between">
                <a href="/" class="sans-typo-detail hover:underline">Home</a>
                <a href="/bio" class="sans-typo-detail hover:underline">Bio</a>
            </div>
        </div>
    </div>
{:else}
    <ScrollProgress />
    <div class="p-8 flex flex-col h-full overflow-y-auto" on:scroll={handleScroll}>
        <div class="absolute aspect-square w-16 transition-opacity duration-200" class:opacity-0={scrolled}>
            <AsteriskBig/>
        </div>
        <div class="pt-40 flex flex-col items-center mb-40">
            <div class="max-w-140 flex flex-col">
                <p class="serif-typo text-wrap mb-4">
                    Under Construction
                </p>
                <hr class="h-px mt-12 mb-8 bg-light">
                <p class="py-2 serif-typo-paragraph text-wrap">
                    Updated on 24/02/2025
                </p>
                <p class="py-2 serif-typo-paragraph text-wrap">
                    Inspired by
                    <a href="https://sive.rs/nowff" class="underline decoration-wavy hover:text-stone-100"
                       target=_blank
                       rel="noopener noreferrer">
                        Derek Sivers
                    </a>
                    and
                    <a href="https://nownownow.com" class="underline decoration-wavy hover:text-stone-100"
                       target=_blank
                       rel="noopener noreferrer">
                        nownownow
                    </a>
                </p>
                <hr class="h-px mb-12 mt-8 bg-light">
                <div class="flex justify-between">
                    <a href="/" class="sans-typo-detail hover:underline">Home</a>
                    <a href="/bio" class="sans-typo-detail hover:underline">Bio</a>
                </div>
            </div>
        </div>
    </div>
{/if}
