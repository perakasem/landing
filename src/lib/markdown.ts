import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
// @ts-ignore
import rehypeFigure from '@microflash/rehype-figure';
import rehypeRaw from "rehype-raw";

/**
 * Markdown processor for rendering database content
 */
export const markdownProcessor = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkRehype, { allowDangerousHtml: true })
	.use(rehypeRaw)
	.use(rehypeFigure)
	.use(rehypeStringify);

/**
 * Replace Directus asset proxy URLs with R2 CDN URLs
 * @param markdown - Raw markdown with potential Directus URLs
 * @returns Markdown with R2 URLs (extension removed)
 */
function replaceAssetUrls(markdown: string): string {
	// Pattern: https://cms.perakasem.com/assets/UUID.ext
	// Becomes: https://assets.perakasem.com/UUID
	return markdown.replace(
		/https?:\/\/cms\.perakasem\.com\/assets\/([^/\s)]+)/g,
		(match, filename) => {
			// Remove extension (everything after first dot)
			// UUID.png → UUID, UUID.jpg → UUID
			const uuid = filename.split('.')[0];
			return `https://assets.perakasem.com/${uuid}`;
		}
	);
}

/**
 * Convert markdown string to HTML
 * @param markdown - Raw markdown content from database
 * @returns HTML string ready for {@html} rendering
 */
export async function markdownToHtml(markdown: string): Promise<string> {
	// Replace asset URLs before processing
	const cleanedMarkdown = replaceAssetUrls(markdown);
	const result = await markdownProcessor.process(cleanedMarkdown);
	return String(result);
}
