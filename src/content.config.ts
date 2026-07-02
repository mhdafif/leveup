import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const TOPICS_BASE = "./src/content/topics";

// Strip a leading numeric ordering prefix like "01-" or "02_" from a filename.
const stripOrderPrefix = (name: string) => name.replace(/^\d+[-_]?/, "");

const topics = defineCollection({
  // One `_topic.md` per topic folder holds the topic's metadata.
  loader: glob({
    pattern: "*/_topic.md",
    base: TOPICS_BASE,
    generateId: ({ entry }) => entry.split("/")[0],
  }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(0),
    description: z.string().default(""),
    icon: z.string().optional(),
    accent: z.string().optional(),
  }),
});

const lessons = defineCollection({
  // Every other markdown file in a topic folder is a lesson (subtopic).
  loader: glob({
    pattern: "*/[0-9]*.md",
    base: TOPICS_BASE,
    generateId: ({ entry }) => {
      const [dir, file] = entry.split("/");
      return `${dir}/${stripOrderPrefix(file.replace(/\.md$/, ""))}`;
    },
  }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(0),
    checklist: z.array(z.string()).default([]),
    estMinutes: z.number().optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  }),
});

export const collections = { topics, lessons };
