// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';

// GitHub Pages project site: https://dileepadev.github.io/learn-ai-901
// `base` must match the repository name. Set BASE_PATH="/" (or use a custom
// domain) to build for a root-hosted deployment instead.
const base = process.env.BASE_PATH ?? '/learn-ai-901';
const site = process.env.SITE_URL ?? 'https://dileepadev.github.io';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  output: 'static',
  integrations: [svelte(), sitemap()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  fonts: [
    {
      // One variable family for everything: crisp at UI sizes, comfortable
      // for long lessons, with real italics. Code uses the system mono.
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['400 700'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
  ],
  build: {
    // Emit /page/index.html so GitHub Pages serves clean URLs without a server.
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      // The question bank is large but static; keep it in one cacheable chunk.
      chunkSizeWarningLimit: 1200,
    },
  },
});
