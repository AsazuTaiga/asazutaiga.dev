import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/posts',
  }),
  schema: z.object({
    title: z.string().min(1),
    createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
});

export const collections = {
  posts,
};
