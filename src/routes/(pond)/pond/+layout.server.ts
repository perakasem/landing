import { getCachedSiteConfig } from '$lib/server/config';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	try {
		const config = await getCachedSiteConfig();
		return { config };
	} catch (error) {
		console.error('Error loading site config in pond layout:', error);
		// Return fallback to prevent page from breaking
		return {
			config: {
				title: '3rd Space',
				description: 'A bootleg substack of thoughts and things worth sharing.',
				currentChapter: "'25",
				url: 'https://perakasem.com/pond',
				watchUrl: null,
				watch: null,
				watchSource: null,
				mediaUrl: null,
				media: null,
				mediaSource: null,
				readUrl: null,
				read: null,
				readSource: null,
				artworkSrc: '/blank.jpg',
				artwork: null,
				artist: null
			}
		};
	}
};
