import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

const posts = await getCollection('posts');
const pages = Object.fromEntries(
  posts.map((post) => [
    post.id,
    {
      title: post.data.title,
    },
  ]),
);

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'slug',
  pages,
  getSlug: (path) => path,
  getImageOptions: (_path, page) => ({
    title: page.title,
    bgGradient: [
      [250, 247, 242],
      [245, 239, 230],
    ],
    border: {
      color: [216, 120, 41],
      width: 10,
      side: 'block-end',
    },
    padding: 72,
    font: {
      title: {
        families: ['Noto Serif JP'],
        weight: 'Bold',
        color: [66, 46, 31],
        size: 68,
        lineHeight: 1.24,
      },
    },
    fonts: [
      'https://fonts.gstatic.com/s/notoserifjp/v33/xn71YHs72GKoTvER4Gn3b5eMRtWGkp6o7MjQ2bzWPebA.ttf',
    ],
  }),
});
