import { browser } from '$app/environment';
import { writable } from 'svelte/store';

/**
 * Theme type definition
 */
export type ThemeType = 'dark' | 'light';

/**
 * Validate and normalize theme value
 */
function normalizeTheme(value: string): ThemeType {
	return value === 'light' || value === 'dark' ? value : 'dark';
}

/**
 * Create theme store with localStorage persistence
 */
function createThemeStore() {
	// Get initial theme from localStorage or default to 'dark'
	const storedTheme = browser ? (localStorage.getItem('theme') ?? 'dark') : 'dark';
	const initialTheme = normalizeTheme(storedTheme);

	const store = writable<ThemeType>(initialTheme);

	// Persist to localStorage on changes
	if (browser) {
		store.subscribe((value) => {
			localStorage.setItem('theme', value);
			// Update DOM class for dark mode
			document.documentElement.classList.toggle('dark', value === 'dark');
		});
	}

	return {
		subscribe: store.subscribe,
		set: store.set,
		update: store.update,
		/**
		 * Toggle between dark and light themes
		 */
		toggle: () => {
			store.update((current) => (current === 'dark' ? 'light' : 'dark'));
		}
	};
}

export const themeStore = createThemeStore();
