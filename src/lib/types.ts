export type Post = {
	id?: string; // Optional for backward compatibility with file-based posts
	title: string;
	subtitle: string;
	chapter: string;
	form: string;
	category: string;
	slug: string;
	date: string;
	tags: string[];
	excerpt: string;
	published: boolean;
	content?: string; // Markdown/HTML content (from CMS)
	featuredImage?: string; // Optional featured image URL
};

export interface GalleryImage {
	src: string;
	alt: string;
}

export type GalleryImageWithIndex = {
	src: string;
	alt: string;
	index: number;
};

export interface PageData {
	images: GalleryImage[];
}
