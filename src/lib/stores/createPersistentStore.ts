import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Create a Svelte store that persists to localStorage
 * @param key - LocalStorage key
 * @param initialValue - Default value if nothing in localStorage
 * @param serialize - Function to serialize value to string (default: identity for strings)
 * @param deserialize - Function to deserialize string to value (default: identity for strings)
 * @returns Writable store with localStorage persistence
 */
export function createPersistentStore<T>(
	key: string,
	initialValue: T,
	serialize: (value: T) => string = (v) => String(v),
	deserialize: (value: string) => T = (v) => v as T
): Writable<T> {
	// Get initial value from localStorage if available
	const storedValue = browser ? localStorage.getItem(key) : null;
	const value = storedValue ? deserialize(storedValue) : initialValue;

	// Create the store
	const store = writable<T>(value);

	// Subscribe to changes and persist to localStorage
	if (browser) {
		store.subscribe((currentValue) => {
			localStorage.setItem(key, serialize(currentValue));
		});
	}

	return store;
}
