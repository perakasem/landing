import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.ts'],
		coverage: {
			reporter: ['text', 'json', 'html'],
			include: ['src/lib/**/*.{js,ts}'],
			exclude: ['src/lib/types/**', '**/*.d.ts', '**/*.config.*']
		}
	},
	resolve: {
		alias: {
			$lib: '/src/lib'
		}
	}
});
