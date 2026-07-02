import type { ContentIndex } from "./types";

// Pure progress math. Progress is a map of `${topicSlug}/${lessonSlug}` to a
// boolean[] of checklist item states. Checklist *lengths* always come from the
// content index (the source of truth), never from the stored array length.

export const lessonKey = (topicSlug: string, lessonSlug: string): string =>
  `${topicSlug}/${lessonSlug}`;

/** Number of completed items in a lesson, capped at the real checklist length. */
export function lessonDone(arr: boolean[] | undefined, len: number): number {
  if (!arr || len <= 0) return 0;
  let done = 0;
  for (let i = 0; i < len; i++) if (arr[i]) done++;
  return done;
}

/** Completion fraction (0..1) for a single lesson. */
export function lessonFraction(arr: boolean[] | undefined, len: number): number {
  return len > 0 ? lessonDone(arr, len) / len : 0;
}

interface Counts {
  done: number;
  total: number;
}

function findTopic(index: ContentIndex, topicSlug: string) {
  return index.topics.find((t) => t.slug === topicSlug);
}

/** Aggregate done/total item counts for one topic. */
export function topicCounts(
  index: ContentIndex,
  progress: Record<string, boolean[]>,
  topicSlug: string,
): Counts {
  const topic = findTopic(index, topicSlug);
  if (!topic) return { done: 0, total: 0 };
  let done = 0;
  let total = 0;
  for (const lesson of topic.lessons) {
    total += lesson.checklistLen;
    done += lessonDone(progress[lessonKey(topicSlug, lesson.slug)], lesson.checklistLen);
  }
  return { done, total };
}

export function topicFraction(
  index: ContentIndex,
  progress: Record<string, boolean[]>,
  topicSlug: string,
): number {
  const { done, total } = topicCounts(index, progress, topicSlug);
  return total > 0 ? done / total : 0;
}

/** A topic is complete only if it has items and they are all done. */
export function isTopicComplete(
  index: ContentIndex,
  progress: Record<string, boolean[]>,
  topicSlug: string,
): boolean {
  const { done, total } = topicCounts(index, progress, topicSlug);
  return total > 0 && done === total;
}

/** Aggregate done/total across every topic. */
export function overallCounts(
  index: ContentIndex,
  progress: Record<string, boolean[]>,
): Counts {
  let done = 0;
  let total = 0;
  for (const topic of index.topics) {
    const c = topicCounts(index, progress, topic.slug);
    done += c.done;
    total += c.total;
  }
  return { done, total };
}

export function overallFraction(
  index: ContentIndex,
  progress: Record<string, boolean[]>,
): number {
  const { done, total } = overallCounts(index, progress);
  return total > 0 ? done / total : 0;
}

/** Total number of checked items across all lessons (for badges/stats). */
export function totalChecked(progress: Record<string, boolean[]>): number {
  let n = 0;
  for (const arr of Object.values(progress)) {
    for (const v of arr) if (v) n++;
  }
  return n;
}

export function checklistLenFor(index: ContentIndex, key: string): number {
  const [topicSlug, lessonSlug] = key.split("/");
  const lesson = findTopic(index, topicSlug)?.lessons.find((l) => l.slug === lessonSlug);
  return lesson?.checklistLen ?? 0;
}
