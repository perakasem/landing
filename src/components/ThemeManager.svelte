<script lang="ts">
	import { onMount } from 'svelte';
	import { themeStore, type ThemeType } from '$lib/stores/themeStore';

	onMount(() => {
		const unsubscribe = themeStore.subscribe((theme) => {
			if (typeof document !== 'undefined') {
				if (theme === 'dark') {
					document.documentElement.classList.add('dark');
				} else {
					document.documentElement.classList.remove('dark');
				}
			}
		});

		return unsubscribe;
	});
</script>
