import type { AppData, ContentIndex, ReviewEase } from "./types";
import { lessonDone, lessonKey } from "./progress";
import { todayISO } from "./gamification";

export interface ReviewCandidate {
  key: string;
  topicSlug: string;
  lessonSlug: string;
  topicTitle: string;
  lessonTitle: string;
  completed: boolean;
  due: boolean;
  lastReviewed?: string;
  reviewCount: number;
  nextReview?: string;
}

export const REVIEW_REWARDS: Record<ReviewEase, { coins: number; xp: number; days: number }> = {
  hard: { coins: 1, xp: 3, days: 1 },
  good: { coins: 2, xp: 5, days: 3 },
  easy: { coins: 3, xp: 8, days: 7 },
};

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00`);
  d.setDate(d.getDate() + days);
  return todayISO(d);
}

export function reviewCandidates(index: ContentIndex, state: AppData, today = todayISO()): ReviewCandidate[] {
  const candidates: ReviewCandidate[] = [];
  for (const topic of index.topics) {
    for (const lesson of topic.lessons) {
      const key = lessonKey(topic.slug, lesson.slug);
      const done = lessonDone(state.progress[key], lesson.checklistLen);
      const completed = lesson.checklistLen > 0 && done === lesson.checklistLen;
      const review = state.review[key];
      if (!completed && !review) continue;
      const due = !review || review.nextReview <= today;
      candidates.push({
        key,
        topicSlug: topic.slug,
        lessonSlug: lesson.slug,
        topicTitle: topic.title,
        lessonTitle: lesson.title,
        completed,
        due,
        lastReviewed: review?.lastReviewed,
        reviewCount: review?.reviewCount ?? 0,
        nextReview: review?.nextReview,
      });
    }
  }

  return candidates.sort((a, b) => Number(b.due) - Number(a.due) || a.topicTitle.localeCompare(b.topicTitle));
}
