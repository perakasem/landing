import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	optimizeDeps: {
		include: ['gsap/ScrollTrigger', 'gsap/ScrollSmoother'],
		exclude: ['svelte/transition']
	}
});
