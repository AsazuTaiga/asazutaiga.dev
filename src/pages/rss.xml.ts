import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { fromContentEntry, getExcerpt, sortPostsByCreatedAtDesc } from '../lib/posts';

export async function GET(context: { site?: URL }) {
  const entries = await getCollection('posts');
  const posts = sortPostsByCreatedAtDesc(entries.map(fromContentEntry));

  return rss({
    title: 'asazutaiga.dev',
    description: 'Asazu Taiga notes',
    site: context.site ?? new URL('https://asazutaiga.dev'),
    items: posts.map((post) => ({
      title: post.title,
      pubDate: new Date(`${post.createdAt}T00:00:00+09:00`),
      description: getExcerpt(post.body, 160),
      link: `/notes/${post.slug}/`,
    })),
    customData: '<language>ja</language>',
  });
}
