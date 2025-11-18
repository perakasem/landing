import { getCachedSiteConfig } from '$lib/server/config';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const config = await getCachedSiteConfig();
	return { config };
};
