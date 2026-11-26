import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogSchema = z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    readingMinutes: z.number().default(4),
    tags: z.array(z.string()).default([]),
    tldr: z.array(z.string()).optional(),
    faqs: z
      .array(
        z.object({
          q: z.string(),
          a: z.string(),
        })
      )
      .optional(),
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: blogSchema,
});

// Otomatik çevrilmiş yazılar: blog-i18n/<dil>/<slug>.md (scratchpad/i18n/blog.py üretir).
const blogI18n = defineCollection({
  loader: glob({ base: './src/content/blog-i18n', pattern: '**/*.md' }),
  schema: blogSchema,
});

export const collections = { blog, blogI18n };
