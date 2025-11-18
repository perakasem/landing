/**
 * Database type definitions for Supabase
 * Auto-generated types can be created with: supabase gen types typescript
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			posts: {
				Row: {
					id: string;
					slug: string;
					title: string;
					subtitle: string | null;
					form: string[]; // JSONB array: ["longform"] or ["shortform"]
					category: string[]; // JSONB array: ["documentary"], etc.
					date: string;
					tags: string[]; // JSONB array: ["tag1", "tag2", ...]
					chapter: string[]; // JSONB array: ["'25"], etc.
					excerpt: string;
					content: string;
					published: boolean;
					featured_image: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					slug: string;
					title: string;
					subtitle?: string | null;
					form: string[]; // JSONB array
					category: string[]; // JSONB array
					date: string;
					tags?: string[]; // JSONB array
					chapter: string[]; // JSONB array
					excerpt: string;
					content: string;
					published?: boolean;
					featured_image?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					slug?: string;
					title?: string;
					subtitle?: string | null;
					form?: string[]; // JSONB array
					category?: string[]; // JSONB array
					date?: string;
					tags?: string[]; // JSONB array
					chapter?: string[]; // JSONB array
					excerpt?: string;
					content?: string;
					published?: boolean;
					featured_image?: string | null;
					created_at?: string;
					updated_at?: string;
				};
			};
			site_config: {
				Row: {
					id: string;
					key: string;
					value: Json;
					description: string | null;
					updated_at: string;
				};
				Insert: {
					id?: string;
					key: string;
					value: Json;
					description?: string | null;
					updated_at?: string;
				};
				Update: {
					id?: string;
					key?: string;
					value?: Json;
					description?: string | null;
					updated_at?: string;
				};
			};
			media: {
				Row: {
					id: string;
					filename: string;
					url: string;
					alt_text: string | null;
					caption: string | null;
					mime_type: string | null;
					size_bytes: number | null;
					created_at: string;
				};
				Insert: {
					id?: string;
					filename: string;
					url: string;
					alt_text?: string | null;
					caption?: string | null;
					mime_type?: string | null;
					size_bytes?: number | null;
					created_at?: string;
				};
				Update: {
					id?: string;
					filename?: string;
					url?: string;
					alt_text?: string | null;
					caption?: string | null;
					mime_type?: string | null;
					size_bytes?: number | null;
					created_at?: string;
				};
			};
			content_pages: {
				Row: {
					id: string;
					slug: string;
					title: string;
					content: Json;
					meta_description: string | null;
					published: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					slug: string;
					title: string;
					content: Json;
					meta_description?: string | null;
					published?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					slug?: string;
					title?: string;
					content?: Json;
					meta_description?: string | null;
					published?: boolean;
					created_at?: string;
					updated_at?: string;
				};
			};
		};
		Views: {
			published_posts: {
				Row: {
					id: string;
					slug: string;
					title: string;
					subtitle: string | null;
					form: string[]; // JSONB array
					category: string[]; // JSONB array
					date: string;
					tags: string[]; // JSONB array
					chapter: string[]; // JSONB array
					excerpt: string;
					content: string;
					featured_image: string | null;
					created_at: string;
					updated_at: string;
				};
			};
		};
	};
}

/**
 * Content block types for structured content pages
 */
export type ContentBlock =
	| {
			type: 'text';
			content: string;
			className?: string;
	  }
	| {
			type: 'heading';
			level: 1 | 2 | 3 | 4 | 5 | 6;
			content: string;
			className?: string;
	  }
	| {
			type: 'image';
			src: string;
			alt: string;
			caption?: string;
			className?: string;
	  }
	| {
			type: 'button';
			label: string;
			href: string;
			variant?: 'primary' | 'secondary';
			className?: string;
	  }
	| {
			type: 'component';
			componentName: string;
			props?: Record<string, unknown>;
	  }
	| {
			type: 'html';
			content: string;
			className?: string;
	  }
	| {
			type: 'grid';
			columns: number;
			items: ContentBlock[];
			className?: string;
	  };

export interface ContentPageData {
	desktop: ContentBlock[];
	mobile?: ContentBlock[]; // Optional mobile-specific layout
}
