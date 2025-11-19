/**
 * LEGACY POND CONFIGURATION
 * ==========================
 *
 * ⚠️ DEPRECATED: This file is no longer used in production
 *
 * Site configuration is now managed via Directus CMS and stored in Supabase.
 * These values serve as fallback defaults if the database is unavailable.
 *
 * To edit site configuration:
 * 1. Login to Directus CMS
 * 2. Go to Content → Site Config
 * 3. Edit values directly in the admin UI
 *
 * The values below are used as fallbacks in src/lib/server/config.ts
 *
 * @see src/lib/server/config.ts - Current database-driven configuration
 * @see CMS-GUIDE.md - Documentation for managing config via Directus
 */

import { dev } from '$app/environment';

export const title = '3rd Space';
export const description = 'A bootleg substack of thoughts and things worth sharing.';
export const currentChapter = "'25";
export const url = dev ? 'http://localhost:5173/pond' : 'https://perakasem.co/pond';

export const watchUrl = 'https://youtu.be/Q0_W4SWHeWY?si=02AWC2EJLwpe1Owx';
export const watch = 'The Future of Creativity';
export const watchSource = 'Hank Green';

export const mediaUrl = 'https://youtu.be/E8pHAQc4rxA?si=L_0o_9hUGHUmTZut';
export const media = 'MF DOOM X Tatsuro Yamashita';
export const mediaSource = 'Tanda';

export const readUrl = 'https://situational-awareness.ai/';
export const read = 'Situational Awareness';
export const readSource = 'Leopold Aschenbrenner';

export const artworkSrc = '/blank.jpg';
export const artwork = 'Tomato Water';
export const artist = 'OC';
