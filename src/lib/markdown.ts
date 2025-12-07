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
 * @returns Markdown with R2 URLs
 */
function replaceAssetUrls(markdown: string): string {
	// Replace cms.perakasem.com/assets/ URLs with assets.perakasem.com/
	// Note: This is a simple domain replacement. If you need file extensions,
	// you'll need to query the database for filename_disk instead.
	return markdown.replace(
		/https?:\/\/cms\.perakasem\.com\/assets\//g,
		'https://assets.perakasem.com/'
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
