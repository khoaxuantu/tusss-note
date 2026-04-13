import type { CollectionConfig } from "astro/content/config";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const ArticleSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  author: z.string().optional(),
  prev_article: z
    .object({
      path: z.string(),
      title: z.string(),
    })
    .optional(),
  next_article: z
    .object({
      path: z.string(),
      title: z.string(),
    })
    .optional(),
});

const articleDir = ["dsa", "js", "oop", "system-design"] as const;
const articleColl: Record<
  `articles.${(typeof articleDir)[number]}`,
  CollectionConfig<typeof ArticleSchema>
> = {} as Record<string, CollectionConfig<typeof ArticleSchema>>;

articleDir.forEach((dir) => {
  const key = `articles.${dir}`;
  articleColl[key] = defineCollection({
    loader: glob({
      base: `./src/articles/${dir}`,
      pattern: [`**/*.{md,mdx}`, "!index.{md,mdx}"],
      retainBody: false,
    }),
    schema: ArticleSchema,
  });
});

const topicColl = defineCollection({
  loader: glob({ base: "./src/articles", pattern: "*/index.{md,mdx}", retainBody: false }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
  }),
});

export const collections = { topic: topicColl, ...articleColl };
