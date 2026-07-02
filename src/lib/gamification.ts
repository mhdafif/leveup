import type { AppData, ContentIndex } from "./types";
import { COIN_RULES, XP_PER_LEVEL } from "../data/config";
import { checklistLenFor, isTopicComplete, lessonDone } from "./progress";
import { BADGES } from "../data/badges";

// ---- dates (local-day based) ------------------------------------------------

export function todayISO(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function yesterdayOf(today: string): string {
  const [y, m, d] = today.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  return todayISO(dt);
}

// ---- levels -----------------------------------------------------------------

export function levelForXp(xp: number): number {
  return Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1;
}

/** Progress within the current level, for a level bar. */
export function xpIntoLevel(xp: number): { into: number; needed: number } {
  return { into: Math.max(0, xp) % XP_PER_LEVEL, needed: XP_PER_LEVEL };
}

// ---- coin/xp awards ---------------------------------------------------------

export interface AwardDelta {
  coins: number;
  xp: number;
  lessonCompleted: boolean; // newly reached 100%
  topicCompleted: boolean; // newly reached 100%
}

function lessonComplete(arr: boolean[] | undefined, len: number): boolean {
  return len > 0 && lessonDone(arr, len) === len;
}

/**
 * Coin/XP delta for toggling one checklist item. Positive on check, negative on
 * uncheck, including lesson- and topic-completion bonuses. Pure: derives
 * before/after completion from the previous state plus the toggle.
 */
export function awardForToggle(
  prev: AppData,
  key: string,
  idx: number,
  checked: boolean,
  index: ContentIndex,
): AwardDelta {
  const [topicSlug] = key.split("/");
  const len = checklistLenFor(index, key);

  const before = prev.progress[key] ? [...prev.progress[key]] : [];
  const after = [...before];
  after[idx] = checked;

  const lessonWas = lessonComplete(before, len);
  const lessonNow = lessonComplete(after, len);

  const topicWas = isTopicComplete(index, prev.progress, topicSlug);
  const topicNow = isTopicComplete(index, { ...prev.progress, [key]: after }, topicSlug);

  let coins = checked ? COIN_RULES.perItem : -COIN_RULES.perItem;
  if (!lessonWas && lessonNow) coins += COIN_RULES.lessonComplete;
  if (lessonWas && !lessonNow) coins -= COIN_RULES.lessonComplete;
  if (!topicWas && topicNow) coins += COIN_RULES.topicComplete;
  if (topicWas && !topicNow) coins -= COIN_RULES.topicComplete;

  return {
    coins,
    xp: coins,
    lessonCompleted: !lessonWas && lessonNow,
    topicCompleted: !topicWas && topicNow,
  };
}

// ---- streak -----------------------------------------------------------------

export interface StreakResult {
  streak: AppData["streak"];
  bonusCoins: number;
}

/** Advance the streak for the first study action of `today`. Idempotent per day. */
export function applyStreak(state: AppData, today: string): StreakResult {
  const s = state.streak;
  if (s.lastDay === today) return { streak: s, bonusCoins: 0 };

  const current = s.lastDay && yesterdayOf(today) === s.lastDay ? s.current + 1 : 1;
  const longest = Math.max(s.longest, current);
  const bonusCoins = Math.min(COIN_RULES.perStreakDay * current, COIN_RULES.streakBonusCap);
  return { streak: { current, longest, lastDay: today }, bonusCoins };
}

// ---- daily goal -------------------------------------------------------------

export interface DailyGoalResult {
  dailyGoal: AppData["dailyGoal"];
  reached: boolean; // crossed the target on this bump
}

/** Adjust today's completed count, resetting when the day rolls over. */
export function bumpDailyGoal(
  state: AppData,
  today: string,
  direction: 1 | -1 = 1,
): DailyGoalResult {
  const g = state.dailyGoal;
  const prevDone = g.date === today ? g.doneToday : 0;
  const doneToday = Math.max(0, prevDone + direction);
  return {
    dailyGoal: { target: g.target, date: today, doneToday },
    reached: direction > 0 && prevDone < g.target && doneToday >= g.target,
  };
}

// ---- badges -----------------------------------------------------------------

/** Badge ids newly earned in `state` that aren't already recorded. */
export function evaluateBadges(state: AppData, index: ContentIndex): string[] {
  return BADGES.filter((b) => !state.badges.includes(b.id) && b.earned(state, index)).map(
    (b) => b.id,
  );
}
