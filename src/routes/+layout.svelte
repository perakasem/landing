<script lang="ts">
    import '../app.css';
    import '../tailwind.css';
    import { fade, crossfade, fly, slide, scale, draw } from 'svelte/transition';
    import { sideImage } from '$lib/stores/sideImageStore';
    import { attributionClass } from '$lib/stores/attributionStore';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import LoadingScreen from '../components/LoadingScreen.svelte';

    let windowTooSmall = false;
    let loading = true;
    let loadingProgress = 0;
    let assetsToLoad: string[] = [];

    // Track all images that need to be loaded
    function collectAssetUrls() {
        assetsToLoad = [
            '/default-image.JPG',
            '/bg3.JPG',
            '/bg4.JPG',
            // Add any other assets that need to be preloaded
        ];
    }

    // Load a single image and update progress
    function loadImage(src: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                loadingProgress += Math.floor(100 / assetsToLoad.length);
                resolve();
            };
            img.onerror = reject;
            img.src = src;
        });
    }

    // Load all assets
    async function loadAllAssets() {
        collectAssetUrls();
        try {
            await Promise.all(assetsToLoad.map(loadImage));
            // Add a small delay for smoother transition
            await new Promise(resolve => setTimeout(resolve, 500));
            loading = false;
        } catch (error) {
            console.error('Failed to load assets:', error);
            loading = false; // Continue anyway
        }
    }

    function checkWindowSize() {
        windowTooSmall = window.innerHeight < 600 ||
            window.innerWidth < 320 ||
            (window.innerWidth / window.innerHeight > 2.2);
    }

    onMount(() => {
        checkWindowSize();
        loadAllAssets();
        window.addEventListener('resize', checkWindowSize);
        return () => window.removeEventListener('resize', checkWindowSize);
    })

    export let data: { scrollable?: boolean };
    const scrollable = data?.scrollable ?? false;
</script>

{#if loading}
    <LoadingScreen progress={loadingProgress} />
{:else}
    {#if windowTooSmall}
        <div in:fade={{ duration: 300 }}
             out:fade={{ duration: 300 }}
             class="fixed inset-0 bg-dark serif-warning flex items-center justify-center z-50 p-20"
        >
            <p>Please adjust your window or rotate your mobile device to provide ample space for the best viewing experience.</p>
        </div>
    {/if}

    <div class="flex min-h-screen h-screen sans-typo bg-dark overflow-hidden">
        <div class="w-2/3 h-screen {scrollable ? 'overflow-y-auto' : 'overflow-hidden'}">
            {#key $page.url.pathname}
                <div class="relative w-full h-full" in:fade={{ duration: 500 }}>
                    <slot />
                </div>
            {/key}
        </div>
        <div class="w-1/3 overflow-hidden">
            {#if $sideImage}
                <img
                        src="{$sideImage}"
                        alt="background"
                        class="w-full h-full object-cover"
                />
            {/if}
        </div>
    </div>

    <div class="fixed inset-y-0 right-0 w-8 pointer-events-none">
        <div class="w-full h-full backdrop-blur-md"></div>
    </div>

    <div class="fixed bottom-0 right-2 rotate-90 origin-top-right {$attributionClass}">
        <p>&copy; 2025 Pera Kasemsripitak. All Rights Reserved. |
            <a href="/privacy" class="hover:font-semibold transition">Privacy Policy</a> |
            <a href="/terms" class="hover:font-semibold transition">Terms of Use</a> |
            <a href="/construction" class="hover:font-semibold transition">Archive</a>
        </p>
    </div>
{/if}
