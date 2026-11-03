import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { remarkTwitterEmbeds } from './src/lib/remark-twitter-embeds.mjs';
import { localMedia } from './scripts/local-media.mjs';

export default defineConfig({
  site: 'https://asazutaiga.dev',
  integrations: [mdx(), sitemap()],
  vite: { plugins: [localMedia()] },
  markdown: {
    remarkPlugins: [remarkGfm, remarkBreaks, remarkTwitterEmbeds],
  },
  redirects: {
    '/post/[slug]': '/notes/[slug]',
  },
});
