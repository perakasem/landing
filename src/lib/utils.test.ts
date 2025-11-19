import { describe, it, expect } from 'vitest';
import {
	formatDate,
	convertDateSeparators,
	compareDates,
	sortPostsByDate,
	formatTagsForDisplay
} from './utils';
import type { Post } from './types';

describe('formatDate', () => {
	it('should format date in long format by default', () => {
		const result = formatDate('2024-01-15');
		expect(result).toBe('January 15, 2024');
	});

	it('should handle different date styles', () => {
		const date = '2024-01-15';
		expect(formatDate(date, 'short')).toBe('1/15/24');
		expect(formatDate(date, 'medium')).toBe('Jan 15, 2024');
		expect(formatDate(date, 'long')).toBe('January 15, 2024');
	});

	it('should handle Safari date format (dashes to slashes)', () => {
		const result = formatDate('2024-01-15');
		expect(result).toBeTruthy();
		expect(result).toContain('2024');
	});
});

describe('convertDateSeparators', () => {
	it('should convert YYYY-MM-DD to DD/MM/YYYY', () => {
		expect(convertDateSeparators('2024-01-15')).toBe('15/01/2024');
	});

	it('should handle single digit days and months', () => {
		expect(convertDateSeparators('2024-01-05')).toBe('05/01/2024');
		expect(convertDateSeparators('2024-12-31')).toBe('31/12/2024');
	});

	it('should return original string if format is invalid', () => {
		expect(convertDateSeparators('invalid')).toBe('invalid');
		expect(convertDateSeparators('2024-01')).toBe('2024-01');
	});
});

describe('compareDates', () => {
	const post1: Post = {
		slug: 'post-1',
		title: 'Post 1',
		subtitle: '',
		form: 'longform',
		category: 'documentary',
		date: '2024-01-01',
		tags: [],
		chapter: "'25",
		excerpt: '',
		content: '',
		published: true
	};

	const post2: Post = {
		slug: 'post-2',
		title: 'Post 2',
		subtitle: '',
		form: 'longform',
		category: 'documentary',
		date: '2024-01-15',
		tags: [],
		chapter: "'25",
		excerpt: '',
		content: '',
		published: true
	};

	it('should compare dates in descending order by default', () => {
		expect(compareDates(post1, post2)).toBeGreaterThan(0);
		expect(compareDates(post2, post1)).toBeLessThan(0);
	});

	it('should compare dates in ascending order when specified', () => {
		expect(compareDates(post1, post2, 'asc')).toBeLessThan(0);
		expect(compareDates(post2, post1, 'asc')).toBeGreaterThan(0);
	});

	it('should return 0 for equal dates', () => {
		const result = compareDates(post1, post1);
		expect(Math.abs(result)).toBe(0);
	});
});

describe('sortPostsByDate', () => {
	const posts: Post[] = [
		{
			slug: 'post-1',
			title: 'Post 1',
			subtitle: '',
			form: 'longform',
			category: 'documentary',
			date: '2024-01-15',
			tags: [],
			chapter: "'25",
			excerpt: '',
			content: '',
			published: true
		},
		{
			slug: 'post-2',
			title: 'Post 2',
			subtitle: '',
			form: 'longform',
			category: 'documentary',
			date: '2024-01-01',
			tags: [],
			chapter: "'25",
			excerpt: '',
			content: '',
			published: true
		},
		{
			slug: 'post-3',
			title: 'Post 3',
			subtitle: '',
			form: 'longform',
			category: 'documentary',
			date: '2024-01-30',
			tags: [],
			chapter: "'25",
			excerpt: '',
			content: '',
			published: true
		}
	];

	it('should sort posts by date in descending order by default', () => {
		const sorted = sortPostsByDate(posts);
		expect(sorted[0].date).toBe('2024-01-30');
		expect(sorted[1].date).toBe('2024-01-15');
		expect(sorted[2].date).toBe('2024-01-01');
	});

	it('should sort posts by date in ascending order when specified', () => {
		const sorted = sortPostsByDate(posts, 'asc');
		expect(sorted[0].date).toBe('2024-01-01');
		expect(sorted[1].date).toBe('2024-01-15');
		expect(sorted[2].date).toBe('2024-01-30');
	});

	it('should not mutate original array', () => {
		const original = [...posts];
		sortPostsByDate(posts);
		expect(posts).toEqual(original);
	});
});

describe('formatTagsForDisplay', () => {
	it('should format tags as comma-separated string', () => {
		expect(formatTagsForDisplay(['tag1', 'tag2', 'tag3'])).toBe('tag1, tag2, tag3');
	});

	it('should handle single tag', () => {
		expect(formatTagsForDisplay(['single'])).toBe('single');
	});

	it('should handle empty array', () => {
		expect(formatTagsForDisplay([])).toBe('');
	});
});
