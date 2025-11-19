import type { Config } from 'tailwindcss';

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			animation: {
				marquee: 'marquee 20s linear infinite'
			},
			keyframes: {
				marquee: {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-50%)' }
				}
			}
		}
	},
	plugins: []
} satisfies Config;
