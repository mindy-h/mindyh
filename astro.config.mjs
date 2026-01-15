// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	build: {
		inlineStylesheets: 'auto',
	},
	image: {
		domains: [],
		remotePatterns: [],
	},
	vite: {
		build: {
			cssMinify: true,
			// Astro/Vite uses esbuild for minification by default (faster than terser)
			// Minification is enabled by default in production builds
		},
	},
});
