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

<div
	class="bg-light transition-height fixed top-0 left-0 w-0.5 duration-100"
	style="height: {progress}%"
></div>
