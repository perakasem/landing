<script lang="ts">
    import '../app.css';
    import '../tailwind.css';
    import { page } from '$app/state';
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import LoadingScreen from '../components/LoadingScreen.svelte';

    let windowTooSmall = $state(false);
    let loading = $state(true);
    let loadingProgress = $state(0);
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

    const props = $props();
    const children = props.children;

    $effect(() => {
        if (page.error) {
            loading = false;
        }
    });
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

    <div class="flex bg-dark sans-typo">
        {@render children()}
    </div>
{/if}
