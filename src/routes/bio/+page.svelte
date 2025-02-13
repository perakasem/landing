<script lang="ts">
    import { onMount } from 'svelte';

    const mobileBreakpoint = 640;
    let isMobile = false;

    function updateViewport() {
        isMobile = window.innerWidth < mobileBreakpoint;
    }

    onMount(() => {
        updateViewport();
        window.addEventListener('resize', updateViewport);
        return () => window.removeEventListener('resize', updateViewport);
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
        <div class="col-span-3 pt-10">
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
        <div class="aspect-square">
        </div>
    {/if}
</div>