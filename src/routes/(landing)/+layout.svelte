<script lang="ts">
    import '../../app.css';
    import '../../tailwind.css';
    import { fade } from 'svelte/transition';
    import { sideImage } from '$lib/stores/sideImageStore.js';
    import { attributionClass } from '$lib/stores/attributionStore.js';
    import { page } from '$app/state';

    const props = $props();
    const scrollable = props.scrollable ?? false;
    const children = props.children;
</script>

<div class="flex w-screen h-screen min-h-screen overflow-hidden">
    <div class="w-2/3 h-screen min-h-screen class:overflow-y-auto={scrollable} class:overflow-hidden={!scrollable}">
        {#key page.url.pathname}
            <div class="relative w-full h-full" in:fade={{ duration: 500 }}>
                {@render children()}
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
</div>
