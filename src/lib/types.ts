export type Post = {
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