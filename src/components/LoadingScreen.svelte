<style>
    .animate-\[spin-loading\] {
        animation: spin ease-out 8000ms;
    }
</style>

<script lang="ts">
    import { fade } from 'svelte/transition';

    export let progress: number = 0;
</script>

<div
        class="fixed inset-0 bg-dark z-50 flex flex-col items-center justify-center"
        in:fade={{ duration: 300 }}
        out:fade={{ duration: 500 }}
>
    <div class="relative w-24 h-24">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 asterisk-line animate-[spin-loading]"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 asterisk-line rotate-45 animate-[spin-loading]"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 asterisk-line rotate-90 animate-[spin-loading]"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 asterisk-line rotate-135 animate-[spin-loading]"></div>
    </div>
    <div class="mt-8 serif-typo text-lg">{progress}%</div>
</div>