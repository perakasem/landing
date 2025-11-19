<script lang="ts">
	import { fade } from 'svelte/transition';

	export let progress: number = 0;
</script>

<div
	class="bg-dark fixed inset-0 z-50 flex flex-col items-center justify-center"
	in:fade={{ duration: 300 }}
	out:fade={{ duration: 500 }}
>
	<div class="relative h-24 w-24">
		<div
			class="asterisk-line absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin-loading]"
		></div>
		<div
			class="asterisk-line absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 animate-[spin-loading]"
		></div>
		<div
			class="asterisk-line absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 animate-[spin-loading]"
		></div>
		<div
			class="asterisk-line absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-135 animate-[spin-loading]"
		></div>
	</div>
	<div class="serif-typo mt-8 text-lg">{progress}%</div>
</div>

<style>
	.animate-\[spin-loading\] {
		animation: spin ease-out 8000ms;
	}
</style>
