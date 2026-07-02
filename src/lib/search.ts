import type { UserTopic } from "./types";
import { fuzzyMatchIndices } from "./fuzzy";

export interface SearchLesson {
  slug: string;
  title: string;
  checklist: string[];
}

export interface SearchTopic {
  slug: string;
  title: string;
  lessons: SearchLesson[];
}

export interface SearchResult {
  title: string;
  url: string;
  kind: "topic" | "lesson";
  source: "built-in" | "user";
}

export function buildSearchResults(_input: {
  topics: SearchTopic[];
  userTopics: UserTopic[];
  query: string;
}): SearchResult[] {
  const { topics, userTopics, query } = _input;
  const q = query.trim();
  if (q.length < 3) return [];
  const matches = (text: string) => fuzzyMatchIndices(text, q).length > 0;
  const results: SearchResult[] = [];

  for (const topic of topics) {
    if (matches(topic.title)) {
      results.push({
        title: topic.title,
        url: `/topics/${topic.slug}`,
        kind: "topic",
        source: "built-in",
      });
    }

    for (const lesson of topic.lessons) {
      const title = `${topic.title} · ${lesson.title}`;
      if (matches(title)) {
        results.push({
          title,
          url: `/topics/${topic.slug}/${lesson.slug}`,
          kind: "lesson",
          source: "built-in",
        });
      }
    }
  }

  for (const topic of userTopics) {
    if (matches(topic.title)) {
      results.push({
        title: topic.title,
        url: `/u?t=${topic.id}`,
        kind: "topic",
        source: "user",
      });
    }

    for (const lesson of topic.lessons) {
      const title = `${topic.title} · ${lesson.title}`;
      if (matches(title)) {
        results.push({
          title,
          url: `/u?t=${topic.id}&l=${lesson.slug}`,
          kind: "lesson",
          source: "user",
        });
      }
    }
  }

  return results;
}
