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

/// <reference types="mdsvex/globals" />

declare module '*.md' {
	const render: () => { html: string };
	export const metadata: Record<string, unknown>;
	export default render;
}

export {};
