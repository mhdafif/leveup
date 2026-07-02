import { getCollection } from "astro:content";
import type { ContentIndex, TopicMeta } from "./types";

// Builds the topic -> lesson structure from the content collections. Used by the
// /content-index.json endpoint (for client islands) and directly by pages.
export async function getTopics(): Promise<TopicMeta[]> {
  const topics = await getCollection("topics");
  const lessons = await getCollection("lessons");

  return topics
    .sort((a, b) => a.data.order - b.data.order)
    .map((t) => ({
      slug: t.id,
      title: t.data.title,
      description: t.data.description,
      icon: t.data.icon ?? null,
      order: t.data.order,
      lessons: lessons
        .filter((l) => l.id.startsWith(`${t.id}/`))
        .sort((a, b) => a.data.order - b.data.order)
        .map((l) => ({
          slug: l.id.slice(t.id.length + 1),
          title: l.data.title,
          order: l.data.order,
          checklistLen: l.data.checklist.length,
          checklist: l.data.checklist,
          difficulty: l.data.difficulty,
          estMinutes: l.data.estMinutes,
        })),
    }));
}

export async function getContentIndex(): Promise<ContentIndex> {
  return { topics: await getTopics() };
}
