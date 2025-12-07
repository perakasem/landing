import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkFootnotes from 'remark-footnotes';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
// @ts-ignore
import rehypeFigure from '@microflash/rehype-figure';

/**
 * Markdown processor for rendering database content
 */
export const markdownProcessor = unified()
	.use(remarkParse)
	.use(remarkGfm)
	.use(remarkFootnotes, { inlineNotes: true })
	.use(remarkRehype)
	.use(rehypeFigure)
	.use(rehypeStringify);

/**
 * Convert markdown string to HTML
 * @param markdown - Raw markdown content from database
 * @returns HTML string ready for {@html} rendering
 */
export async function markdownToHtml(markdown: string): Promise<string> {
	const result = await markdownProcessor.process(markdown);
	return String(result);
}
