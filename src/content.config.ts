import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const topicColl = defineCollection({
  loader: glob({ base: "./src/articles", pattern: "*/index.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    slug: z.string(),
  }),
});

export const collections = { topic: topicColl };
