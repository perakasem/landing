<script>
    import { onMount } from 'svelte';
    let progress = 0;

    onMount(() => {
        const el = document.querySelector('.overflow-y-auto');
        el?.addEventListener('scroll', () => {
            progress = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
        });
    });
</script>

<div class="fixed left-0 top-0 w-0.5 bg-zinc-600 dark:bg-zinc-400 transition-height duration-100"
     style="height: {progress}%">
</div>