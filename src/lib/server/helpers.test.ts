import { describe, it, expect } from 'vitest';

/**
 * CRITICAL HELPER TESTS
 * These functions are essential to the CMS integration
 * Failure of these functions will break the entire blog
 */

/**
 * arrayToString - CRITICAL function for CMS integration
 * Converts JSONB arrays from Directus to strings for the app
 * Database: ["longform"] → App: "longform"
 */
function arrayToString(arr: string[] | null | undefined): string {
	return arr && arr.length > 0 ? arr[0] : '';
}

/**
 * stringToArray - CRITICAL function for CMS integration
 * Converts strings from app to JSONB arrays for database
 * App: "longform" → Database: ["longform"]
 */
function stringToArray(value: string): string[] {
	return [value];
}

describe('arrayToString - CRITICAL CMS INTEGRATION', () => {
	it('should convert single-element array to string', () => {
		expect(arrayToString(['longform'])).toBe('longform');
		expect(arrayToString(['documentary'])).toBe('documentary');
		expect(arrayToString(["'25"])).toBe("'25");
	});

	it('should return first element for multi-element arrays', () => {
		expect(arrayToString(['first', 'second', 'third'])).toBe('first');
	});

	it('should return empty string for null', () => {
		expect(arrayToString(null)).toBe('');
	});

	it('should return empty string for undefined', () => {
		expect(arrayToString(undefined)).toBe('');
	});

	it('should return empty string for empty array', () => {
		expect(arrayToString([])).toBe('');
	});

	it('should handle special characters in strings', () => {
		expect(arrayToString(['tag-with-dash'])).toBe('tag-with-dash');
		expect(arrayToString(['tag_with_underscore'])).toBe('tag_with_underscore');
		expect(arrayToString(['tag with spaces'])).toBe('tag with spaces');
	});

	// EDGE CASES - These should never happen but must be handled
	it('should handle array with empty string', () => {
		expect(arrayToString([''])).toBe('');
	});

	it('should handle array with whitespace', () => {
		expect(arrayToString(['  whitespace  '])).toBe('  whitespace  ');
	});
});

describe('stringToArray - CRITICAL CMS INTEGRATION', () => {
	it('should convert string to single-element array', () => {
		expect(stringToArray('longform')).toEqual(['longform']);
		expect(stringToArray('documentary')).toEqual(['documentary']);
		expect(stringToArray("'25")).toEqual(["'25"]);
	});

	it('should handle empty string', () => {
		expect(stringToArray('')).toEqual(['']);
	});

	it('should handle special characters', () => {
		expect(stringToArray('tag-with-dash')).toEqual(['tag-with-dash']);
		expect(stringToArray('tag_with_underscore')).toEqual(['tag_with_underscore']);
		expect(stringToArray('tag with spaces')).toEqual(['tag with spaces']);
	});

	// CRITICAL TEST: Round-trip conversion must be lossless
	it('should round-trip correctly with arrayToString', () => {
		const original = 'longform';
		const asArray = stringToArray(original);
		const backToString = arrayToString(asArray);
		expect(backToString).toBe(original);
	});
});

describe('CMS Integration - Combined scenarios', () => {
	it('should handle typical post form values', () => {
		const forms = ['longform', 'shortform'];
		forms.forEach((form) => {
			const asArray = stringToArray(form);
			expect(arrayToString(asArray)).toBe(form);
		});
	});

	it('should handle typical category values', () => {
		const categories = ['documentary', 'fiction', 'essay', 'review'];
		categories.forEach((category) => {
			const asArray = stringToArray(category);
			expect(arrayToString(asArray)).toBe(category);
		});
	});

	it('should handle typical chapter values', () => {
		const chapters = ["'24", "'25", "'26"];
		chapters.forEach((chapter) => {
			const asArray = stringToArray(chapter);
			expect(arrayToString(asArray)).toBe(chapter);
		});
	});
});
