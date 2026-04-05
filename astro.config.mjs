import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import { remarkTwitterEmbeds } from './src/lib/remark-twitter-embeds.mjs';

export default defineConfig({
  site: 'https://asazutaiga.dev',
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkGfm, remarkTwitterEmbeds],
  },
  redirects: {
    '/post/[slug]': '/notes/[slug]',
  },
});
