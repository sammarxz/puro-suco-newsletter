import { defineCollection, z } from 'astro:content'

const newsletters = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.date(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    previewText: z.string().optional(),
    issue: z.number(),
    readingTime: z.number().optional(), // Will be calculated automatically if not provided
  }),
})

export const collections = { newsletters }
