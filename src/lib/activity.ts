import type { StudyActivity } from "./types";
import { todayISO } from "./gamification";

export interface DayActivity {
  date: string;
  checklistCount: number;
  reviewCount: number;
  focusCount: number;
  focusSeconds: number;
  totalXp: number;
  totalCoins: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}

export function createActivity(input: Omit<StudyActivity, "id" | "date"> & { date?: string }): StudyActivity {
  return {
    ...input,
    id: `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    date: input.date ?? todayISO(),
  };
}

export function activityByDay(activity: StudyActivity[]): Record<string, DayActivity> {
  const days: Record<string, DayActivity> = {};
  for (const item of activity) {
    const day = days[item.date] ?? {
      date: item.date,
      checklistCount: 0,
      reviewCount: 0,
      focusCount: 0,
      focusSeconds: 0,
      totalXp: 0,
      totalCoins: 0,
      intensity: 0,
    };
    if (item.type === "checklist") day.checklistCount += item.count;
    if (item.type === "review") day.reviewCount += item.count;
    if (item.type === "focus") {
      day.focusCount += item.count;
      day.focusSeconds += item.seconds ?? 0;
    }
    day.totalXp += item.xp;
    day.totalCoins += item.coins;
    const score = day.checklistCount + day.reviewCount + day.focusCount;
    day.intensity = score >= 8 ? 4 : score >= 5 ? 3 : score >= 3 ? 2 : score >= 1 ? 1 : 0;
    days[item.date] = day;
  }
  return days;
}

export interface ActivitySummary {
  focusSessions: number;
  focusMinutes: number;
  checklistItems: number;
  reviews: number;
  activeDays: number;
  topTopicSlug: string | null;
}

/** ISO date `days` days ago (inclusive of today, so days=7 → today + prev 6). */
export function isoDaysAgo(days: number): string {
  const d = new Date(`${todayISO()}T00:00:00`);
  d.setDate(d.getDate() - (days - 1));
  return todayISO(d);
}

/**
 * Aggregate metrics for the stat cards. `days = Infinity` means all-time;
 * otherwise activity is filtered to the trailing window (ISO date strings sort
 * lexicographically, so a string compare is a valid date compare).
 */
export function activitySummary(activity: StudyActivity[], days = Infinity): ActivitySummary {
  const cutoff = Number.isFinite(days) ? isoDaysAgo(days) : null;
  const inRange = cutoff ? activity.filter((a) => a.date >= cutoff) : activity;

  const topicCounts: Record<string, number> = {};
  for (const a of inRange) {
    if (a.topicSlug) topicCounts[a.topicSlug] = (topicCounts[a.topicSlug] ?? 0) + a.count;
  }
  const topTopicSlug =
    Object.entries(topicCounts).sort((x, y) => y[1] - x[1])[0]?.[0] ?? null;

  return {
    focusSessions: inRange.filter((a) => a.type === "focus").reduce((s, a) => s + a.count, 0),
    focusMinutes: Math.round(
      inRange.filter((a) => a.type === "focus").reduce((s, a) => s + (a.seconds ?? 0), 0) / 60,
    ),
    checklistItems: inRange.filter((a) => a.type === "checklist").reduce((s, a) => s + a.count, 0),
    reviews: inRange.filter((a) => a.type === "review").reduce((s, a) => s + a.count, 0),
    activeDays: new Set(inRange.map((a) => a.date)).size,
    topTopicSlug,
  };
}

export function calendarDays(activity: StudyActivity[], today = todayISO(), weeks = 12): DayActivity[] {
  const byDay = activityByDay(activity);
  const end = new Date(`${today}T00:00:00`);
  const totalDays = weeks * 7;
  const out: DayActivity[] = [];

  for (let i = totalDays - 1; i >= 0; i -= 1) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    const date = todayISO(d);
    out.push(
      byDay[date] ?? {
        date,
        checklistCount: 0,
        reviewCount: 0,
        focusCount: 0,
        focusSeconds: 0,
        totalXp: 0,
        totalCoins: 0,
        intensity: 0,
      },
    );
  }

  return out;
}
