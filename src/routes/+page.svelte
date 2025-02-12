<script lang="ts">
    import { slide } from 'svelte/transition';
    import { onMount } from 'svelte';
    import MenuContent from '../components/MenuContent.svelte';

    // --- Section Toggle Logic ---
    let showConnect: boolean = false;
    let showWorks: boolean = false;
    let showAbout: boolean = false;

    const toggleSection = (section: string) => {
        if (section === 'about') {
            showAbout = !showAbout;
            showWorks = false;
            showConnect = false;
        } else if (section === 'works') {
            showWorks = !showWorks;
            showAbout = false;
            showConnect = false;
        } else if (section === 'connect') {
            showConnect = !showConnect;
            showAbout = false;
            showWorks = false;
        }
    };

    // --- Rotating Background Image ---
    let currentImageIndex = 0;
    const images = ['/bg2.JPG', '/bg3.JPG', '/bg4.JPG'];

    function rotateImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
    }

    function scheduleNextRotation() {
        setTimeout(() => {
            rotateImage();
            scheduleNextRotation();
        }, (Math.E ** Math.random()) ** 7);
    }
    scheduleNextRotation();

    // --- Viewport Detection ---
    const mobileBreakpoint = 640;
    // Initialize to a safe default; we'll update this on the client.
    let isMobile = false;

    function updateViewport() {
        isMobile = window.innerWidth < mobileBreakpoint;
    }

    onMount(() => {
        // Now it's safe to access window.
        updateViewport();
        window.addEventListener('resize', updateViewport);
        return () => window.removeEventListener('resize', updateViewport);
    });
</script>

<!-- Main Container -->
<div class="flex min-h-screen sans-typo bg-dark overflow-hidden">
    <!-- Left Side: Content List (Grid) -->
    <div class="grid grid-cols-3 grid-rows-3 gap-4 w-2/3 p-8">
        {#if isMobile}
            <!-- Mobile Order:
                 Render the cell with about/works/connect content second -->
            <div class="relative aspect-square">
                <!-- On mobile: top-0 left-0 (anchored top-left)
                     On larger screens: top-1/2 left-1/2 with translations to center -->
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-45"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-90"></div>
                <div class="absolute top-8 left-0 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 asterisk-line rotate-135"></div>
            </div>
            <div class="aspect-square"></div>
            <div class="aspect-square"></div>
            <div class="aspect-square">
                <MenuContent />
            </div>
        {:else}
            <!-- Desktop Order: -->
            <div class="relative aspect-square">
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 asterisk-line"></div>
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 asterisk-line rotate-45"></div>
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 asterisk-line rotate-90"></div>
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 asterisk-line rotate-135"></div>
            </div>
            <div class="aspect-square"></div>
            <div class="aspect-square"></div>
            <div class="aspect-square"></div>
            <div class="aspect-square">
                <MenuContent />
            </div>
        {/if}
    </div>
    <div class="w-1/3 overflow-hidden">
        <img
                src={images[currentImageIndex]}
                alt="Rotating background"
                class="w-full h-full object-cover"
        />
    </div>
</div>

<!-- Marquee at the bottom -->
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
        to { transform: translateX(-50%); } /* Changed from -100% to -50% */
    }
</style>
