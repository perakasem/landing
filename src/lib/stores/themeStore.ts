// src/lib/stores/themeStore.ts
import { writable } from 'svelte/store';

// Define the Theme type explicitly
export type ThemeType = 'dark' | 'light';

// Create a function to initialize the theme store
function createThemeStore() {
    // Initialize with dark as default, safely check for localStorage
    const getInitialTheme = (): ThemeType => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const stored = window.localStorage.getItem('theme');
                if (stored === 'light' || stored === 'dark') {
                    return stored as ThemeType;
                }
            }
        } catch (e) {
            console.error('Error accessing localStorage:', e);
        }
        return 'dark'; // Default to dark
    };

    const store = writable<ThemeType>(getInitialTheme());

    return {
        subscribe: store.subscribe,
        set: store.set,
        update: store.update,
        toggle: () => {
            store.update(currentTheme => {
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                try {
                    if (typeof window !== 'undefined' && window.localStorage) {
                        window.localStorage.setItem('theme', newTheme);
                    }
                } catch (e) {
                    console.error('Error setting theme in localStorage:', e);
                }
                return newTheme;
            });
        }
    };
}

// Export the store
export const themeStore = createThemeStore();