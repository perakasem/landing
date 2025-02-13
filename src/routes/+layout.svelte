<script lang="ts">
    import '../app.css';
    import '../tailwind.css';
    import { fade, crossfade, fly, slide, scale, draw } from 'svelte/transition';
    import { sideImage } from '$lib/stores/sideImageStore';
    import { attributionClass } from '$lib/stores/attributionStore';
    import { onMount } from 'svelte';
    import { page } from '$app/stores'

    // Background rotation
    let windowTooSmall = false;

    function checkWindowSize() {
        windowTooSmall = window.innerHeight < 600 ||
            window.innerWidth < 320 ||
            (window.innerWidth / window.innerHeight > 1.8);
    }

    onMount(() => {
        checkWindowSize();
        window.addEventListener('resize', checkWindowSize);
        return () => window.removeEventListener('resize', checkWindowSize);
    })

    export let data: { scrollable?: boolean };
    const scrollable = data?.scrollable ?? false;
</script>

{#if windowTooSmall}
    <div in:fade={{ duration: 300 }}
         out:fade={{ duration: 300 }}
         class="fixed inset-0 bg-dark sans-warning flex items-center justify-center z-50 p-20"
    >
        <p>Please adjust your window to provide ample space for the best viewing experience.</p>
    </div>
{/if}

<div class="flex min-h-screen h-screen sans-typo bg-dark overflow-hidden">
    {#key $page.url.pathname}
        <div class="w-2/3 h-screen {scrollable ? 'overflow-y-auto' : 'overflow-hidden'}">
            <div class="relative w-full h-full" in:fade={{ duration: 500 }}>
                <slot />
            </div>
        </div>
    {/key}
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



<div class="fixed inset-y-0 right-0 w-8 pointer-events-none ">
    <div class="w-full h-full backdrop-blur-md"></div>
</div>

<div class="fixed bottom-0 right-2 rotate-90 origin-top-right {$attributionClass}">
    <p>&copy; 2025 Pera Kasemsripitak. All Rights Reserved. |
        <a href="/privacy" class="hover:font-semibold transition">Privacy Policy</a> |
        <a href="/terms" class="hover:font-semibold transition">Terms of Use</a> |
        <a href="/construction" class="hover:font-semibold transition">Archive</a>
    </p>
</div>
