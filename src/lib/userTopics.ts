import type { TopicMeta, UserTopic } from "./types";

// Maps uploaded topics into the same TopicMeta shape the built-in content index
// uses, so progress/gamification/stats treat them identically. User topics sort
// after built-in ones (high order base).
export function userTopicsAsIndex(userTopics: UserTopic[]): TopicMeta[] {
  return userTopics.map((t, i) => ({
    slug: t.id,
    title: t.title,
    description: t.description ?? "",
    icon: t.icon ?? null,
    order: 1000 + i,
    lessons: t.lessons.map((l, j) => ({
      slug: l.slug,
      title: l.title,
      order: j + 1,
      checklistLen: l.checklist.length,
      difficulty: l.difficulty,
      estMinutes: l.estMinutes,
    })),
  }));
}
