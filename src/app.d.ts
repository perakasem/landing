// See https://svelte.dev/docs/kit/types#app.d.ts
// for information bio these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '*.md' {
	const render: () => { html: string };
	export const metadata: Record<string, unknown>;
}

declare module '@microflash/rehype-figure';

export {};
