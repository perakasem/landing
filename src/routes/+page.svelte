<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import MenuContent from '../components/MenuContent.svelte';
    import { sideImage } from '$lib/stores/sideImageStore';
    import { attributionClass } from "$lib/stores/attributionStore.js";

    const mobileBreakpoint = 640;
    const images = ['/default-image.JPG', '/bg3.JPG', '/bg4.JPG'];
    let isMobile = false;
    let currentImageIndex = 0;
    let timerId: ReturnType<typeof setTimeout>;
    attributionClass.set('attribution-typo');

    function updateViewport() {
        isMobile = window.innerWidth < mobileBreakpoint;
    }

    function rotateImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        sideImage.set(images[currentImageIndex]);
    }

    function scheduleNextRotation() {
        timerId = setTimeout(() => {
            rotateImage();
            scheduleNextRotation();
        }, Math.E ** (8 * Math.random()));
    }

    onMount(() => {
        updateViewport();
        sideImage.set(images[currentImageIndex]);
        timerId = setTimeout(() => {
            scheduleNextRotation();
        }, 1000);
        window.addEventListener('resize', updateViewport);
        return () => window.removeEventListener('resize', updateViewport);
    });

    onDestroy(() => {
        clearTimeout(timerId); // Cancel the scheduled rotation when navigating away
    });
</script>

<div class="grid grid-cols-3 grid-rows-3 gap-4 p-8">
    {#if isMobile}
        <div class="relative aspect-square">
            <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line"></div>
            <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-45"></div>
            <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-90"></div>
            <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-135"></div>
        </div>
        <div class="aspect-square"></div>
        <div class="aspect-square"></div>
        <div class="col-span-3 pt-10 h-[200px] overflow-y-visible">
            <MenuContent />
        </div>
    {:else}
        <div class="relative aspect-square">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 asterisk-line"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 asterisk-line rotate-45"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 asterisk-line rotate-90"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 asterisk-line rotate-135"></div>
        </div>
        <div class="aspect-square"></div>
        <div class="aspect-square"></div>
        <div class="aspect-square"></div>
        <div class="aspect-square h-[200px] overflow-y-visible">
            <MenuContent />
        </div>
    {/if}
</div>

<div class="max-sm:hidden w-2/3 fixed bottom-0 sans-title overflow-hidden">
    <div class="marquee">
        <span>PERA KASEMSRIPITAK&nbsp;</span>
    </div>
</div>

<style>
    .marquee {
        white-space: nowrap;
        display: inline-block;
        animation: marquee 60s linear infinite;
    }

    @keyframes marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
    }
</style>

