<script lang="ts">
	/**
	 * Post Preview Component
	 * Displays post title and subtitle with hover effect
	 * Adapts styling for mobile vs desktop
	 */

	let { title, subtitle, isMobile = false }: { title: string; subtitle: string; isMobile?: boolean } =
		$props();
</script>

<div class="post-preview">
	<h2 class={isMobile ? 'serif-typo-h1-mobile text-wrap' : 'serif-typo-h1 text-wrap'}>
		{title}
	</h2>
	<p class={isMobile ? 'sans-typo-title-thin-mobile text-wrap' : 'sans-typo-title-thin text-wrap'}>
		{subtitle}
	</p>
</div>
