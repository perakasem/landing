// mdsvex.config.js
import remarkFigureCaption from '@microflash/remark-figure-caption';
import remarkGfm from 'remark-gfm';
import remarkFootnotes from 'remark-footnotes';

/** @type {import('mdsvex').MdsvexOptions} */
const config = {
	extensions: ['.md', '.svx'],
	smartypants: {
		dashes: 'oldschool'
	},
	remarkPlugins: [remarkFigureCaption, remarkGfm, remarkFootnotes],
	rehypePlugins: []
};

export default config;
