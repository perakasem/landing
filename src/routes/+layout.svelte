<script lang="ts">
    import '../app.css';
    import '../tailwind.css';
    import { fade } from 'svelte/transition';
    import { sideImage } from '$lib/stores/sideImageStore';
    import { onMount } from 'svelte';

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
</script>

{#if windowTooSmall}
    <div in:fade={{ duration: 300 }}
         out:fade={{ duration: 300 }}
         class="fixed inset-0 bg-dark sans-warning flex items-center justify-center z-50 p-20"
    >
        <p>Please adjust your window to provide ample space for the best viewing experience.</p>
    </div>
{/if}

<div class="flex min-h-screen sans-typo bg-dark overflow-hidden">
    <div class="w-2/3">
        <slot />
    </div>
    <div class="w-1/3 overflow-hidden">
        {#if $sideImage}
            <img
                    src="{$sideImage}"
                    alt="Rotating background"
                    class="w-full h-full object-cover"
            />
        {/if}
    </div>
</div>
