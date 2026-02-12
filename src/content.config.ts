import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }),
    pubDate: z.coerce.date(),
    draft: z.boolean().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    link: z.string(),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }),
    pubDate: z.coerce.date(),
    technologies: z.array(z.string()),
  }),
});

export const collections = { blog, projects };
