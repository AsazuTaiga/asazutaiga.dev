import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: z.object({
    emoji: z.string(),
    title: z.string(),
    createdAt: z.string(),
    updatedAt: z.string().optional(),
    published: z.boolean(),
    genre: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
