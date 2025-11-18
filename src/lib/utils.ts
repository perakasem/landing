import type { Post } from './types';

type DateStyle = Intl.DateTimeFormatOptions['dateStyle'];

/**
 * Format a date string using Intl.DateTimeFormat
 * @param date - ISO date string (YYYY-MM-DD)
 * @param dateStyle - Intl.DateTimeFormat style ('full', 'long', 'medium', 'short')
 * @param locales - Locale string for formatting
 * @returns Formatted date string suitable for display
 */
export function formatDate(date: string, dateStyle: DateStyle = 'long', locales = 'en'): string {
	// Replace dashes with slashes for Safari compatibility
	const dateToFormat = new Date(date.replaceAll('-', '/'));
	return new Intl.DateTimeFormat(locales, { dateStyle }).format(dateToFormat);
}

/**
 * Convert ISO date format (YYYY-MM-DD) to DD/MM/YYYY
 * Used for archive table display where a specific format is needed
 * @param date - ISO date string
 * @returns Formatted date string in DD/MM/YYYY format
 */
export function convertDateSeparators(date: string): string {
	const parts = date.split('-');
	if (parts.length !== 3) return date; // fallback if format isn't as expected
	const [year, month, day] = parts;
	return `${day}/${month}/${year}`;
}

/**
 * Compare two posts by date
 * @param a - First post to compare
 * @param b - Second post to compare
 * @param order - Sort order ('asc' for ascending, 'desc' for descending)
 * @returns Comparison result for sort function
 */
export function compareDates(a: Post, b: Post, order: 'asc' | 'desc' = 'desc'): number {
	const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
	return order === 'asc' ? diff : -diff;
}

/**
 * Sort posts by date
 * @param posts - Array of posts to sort
 * @param order - Sort order ('asc' for ascending, 'desc' for descending)
 * @returns New sorted array of posts (does not mutate original)
 */
export function sortPostsByDate(posts: Post[], order: 'asc' | 'desc' = 'desc'): Post[] {
	return [...posts].sort((a, b) => compareDates(a, b, order));
}

/**
 * Extract slug from markdown file path
 * @param path - File path (e.g., '/src/posts/my-post.md')
 * @returns Slug (e.g., 'my-post')
 */
export function extractSlugFromPath(path: string): string {
	return path.split('/').pop()?.replace(/\.md$/, '') ?? '';
}

/**
 * Format tags for display
 * @param tags - Array of tag strings
 * @returns Comma-separated string of tags
 */
export function formatTagsForDisplay(tags: string[]): string {
	return tags.join(', ');
}

/**
 * @deprecated Use formatTagsForDisplay instead
 */
export function parseTags(tags: string[]): string {
	return formatTagsForDisplay(tags);
}
