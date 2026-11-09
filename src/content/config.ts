import { defineCollection, z } from 'astro:content';

const editorialCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.string(),
    author: z.string(),
    lastUpdated: z.string(),
    faq: z.array(
      z.object({
        q: z.string(),
        a: z.string(),
      })
    ),
  }),
});

export const collections = {
  editorial: editorialCollection,
};

