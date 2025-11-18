<script lang="ts">
	/**
	 * Back to Top Button Component
	 * Scrolls to a specified element when clicked
	 * Two variants: minimal and boxed
	 */

	let {
		element,
		variant = 'minimal'
	}: {
		element: HTMLElement;
		variant?: 'minimal' | 'boxed';
	} = $props();

	function scrollToTop() {
		element.scrollIntoView({ behavior: 'smooth' });
	}
</script>

{#if variant === 'boxed'}
	<div class="flex h-fit my-8 button-secondary-accent">
		<p class="archive-entry-mono">↑&nbsp;</p>
		<button onclick={scrollToTop} class="hover:underline"> Back to Top </button>
	</div>
{:else}
	<div class="flex flex-row text-nowrap h-fit">
		<p class="archive-entry-mono text-pond-blue">↑&nbsp;</p>
		<button onclick={scrollToTop} class="hover:underline text-pond-blue mono-typo-nav">
			Back to Top
		</button>
	</div>
{/if}
