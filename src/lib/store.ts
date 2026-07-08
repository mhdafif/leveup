import { atom } from "nanostores";
import type { AppData, ContentIndex, DifficultyMode, Redemption, ReviewEase, Reward, StudyActivity, TopicMeta, UserTopic } from "./types";
import {
  createLocalStorageAdapter,
  defaultData,
  migrate,
  STORAGE_KEY,
} from "./persistence";
import { DEFAULT_REWARDS } from "../data/rewards";
import { userTopicsAsIndex } from "./userTopics";
import {
  applyStreak,
  awardForToggle,
  bumpDailyGoal,
  evaluateBadges,
  todayISO,
  type AwardDelta,
} from "./gamification";
import { lessonKey } from "./progress";
import { createActivity } from "./activity";
import { addDays, REVIEW_REWARDS } from "./review";
import { focusReward } from "./focusSession";

const isBrowser = typeof window !== "undefined";
const adapter = createLocalStorageAdapter();

function initialData(): AppData {
  if (!isBrowser) return defaultData();
  return adapter.load();
}

/** The single source of truth, shared across every island. */
export const appData = atom<AppData>(initialData());

if (isBrowser) {
  appData.listen((value) => adapter.save(value));
}

// ---- content index = built-in (fetched once) + user topics (live) -----------

export const contentIndex = atom<ContentIndex | null>(null);
let builtin: TopicMeta[] | null = null;
let builtinPromise: Promise<TopicMeta[]> | null = null;
let lastUserTopics = appData.get().userTopics;

function recomputeIndex(): void {
  contentIndex.set({
    topics: [...(builtin ?? []), ...userTopicsAsIndex(appData.get().userTopics)],
  });
}

export function ensureIndex(): Promise<ContentIndex> {
  if (builtin) {
    recomputeIndex();
    return Promise.resolve(contentIndex.get()!);
  }
  if (!builtinPromise) {
    builtinPromise = fetch("/content-index.json")
      .then((r) => r.json() as Promise<ContentIndex>)
      .then((idx) => {
        builtin = idx.topics;
        recomputeIndex();
        return builtin;
      });
  }
  return builtinPromise.then(() => contentIndex.get()!);
}

if (isBrowser) {
  // Keep the merged index fresh as the user adds/removes topics.
  appData.subscribe((d) => {
    if (builtin && d.userTopics !== lastUserTopics) {
      lastUserTopics = d.userTopics;
      recomputeIndex();
    }
  });
}

// ---- actions ----------------------------------------------------------------

export interface ToggleResult {
  delta: AwardDelta;
  newBadges: string[];
  goalReached: boolean;
}

/** Toggle a checklist item, applying coins/XP, streak, daily goal, and badges. */
export async function toggleItem(
  key: string,
  idx: number,
  checked: boolean,
): Promise<ToggleResult> {
  const index = await ensureIndex();
  const prev = appData.get();
  const delta = awardForToggle(prev, key, idx, checked, index);

  const arr = prev.progress[key] ? [...prev.progress[key]] : [];
  arr[idx] = checked;

  let next: AppData = {
    ...prev,
    progress: { ...prev.progress, [key]: arr },
    coins: Math.max(0, prev.coins + delta.coins),
    xpTotal: Math.max(0, prev.xpTotal + delta.xp),
  };

  const today = todayISO();
  const goal = bumpDailyGoal(next, today, checked ? 1 : -1);
  let goalReached = goal.reached;
  next = { ...next, dailyGoal: goal.dailyGoal };

  if (checked) {
    const topicSlug = key.split("/")[0];
    const streak = applyStreak(next, today);
    next = {
      ...next,
      coins: next.coins + streak.bonusCoins,
      streak: streak.streak,
      lastStudied: { ...next.lastStudied, [topicSlug]: today },
      activity: [
        createActivity({
          type: "checklist",
          topicSlug,
          lessonSlug: key.split("/")[1],
          count: 1,
          xp: delta.xp,
          coins: delta.coins + streak.bonusCoins,
          date: today,
        }),
        ...next.activity,
      ],
    };
  }

  const newBadges = evaluateBadges(next, index);
  if (newBadges.length) next = { ...next, badges: [...next.badges, ...newBadges] };

  appData.set(next);
  return { delta, newBadges, goalReached };
}

export function setDifficultyMode(mode: DifficultyMode): void {
  const prev = appData.get();
  if (prev.difficultyMode === mode) return;
  appData.set({ ...prev, difficultyMode: mode });
}

export function setNote(key: string, text: string): void {
  const prev = appData.get();
  appData.set({ ...prev, notes: { ...prev.notes, [key]: text } });
}

export interface RedeemableReward {
  id: string;
  coinCost: number;
  rupiah: number;
}

/** Spend coins on a reward. Returns false (no-op) if it can't be afforded. */
export function redeemReward(reward: RedeemableReward): boolean {
  const prev = appData.get();
  if (prev.coins < reward.coinCost) return false;
  const entry: Redemption = {
    id: reward.id,
    date: todayISO(),
    coinCost: reward.coinCost,
    rupiah: reward.rupiah,
  };
  let next: AppData = {
    ...prev,
    coins: prev.coins - reward.coinCost,
    redeemed: [entry, ...prev.redeemed],
  };
  const index = contentIndex.get() ?? { topics: [] };
  const newBadges = evaluateBadges(next, index);
  if (newBadges.length) next = { ...next, badges: [...next.badges, ...newBadges] };
  appData.set(next);
  return true;
}

export function resetTopic(topicSlug: string): void {
  const prev = appData.get();
  const progress = { ...prev.progress };
  for (const k of Object.keys(progress)) {
    if (k.startsWith(`${topicSlug}/`)) delete progress[k];
  }
  appData.set({ ...prev, progress });
}

export function resetAll(): void {
  const prev = appData.get();
  const fresh = defaultData();
  fresh.theme = prev.theme; // keep the chosen theme
  appData.set(fresh);
}

export interface ReviewResult {
  coins: number;
  xp: number;
  nextReview: string;
  reviewCount: number;
}

export function completeReview(key: string, ease: ReviewEase): ReviewResult {
  const prev = appData.get();
  const today = todayISO();
  const reward = REVIEW_REWARDS[ease];
  const current = prev.review[key];
  const nextReview = addDays(today, reward.days);
  const [topicSlug, lessonSlug] = key.split("/");
  const reviewCount = (current?.reviewCount ?? 0) + 1;
  const activity = createActivity({
    type: "review",
    topicSlug,
    lessonSlug,
    count: 1,
    xp: reward.xp,
    coins: reward.coins,
    date: today,
  });

  appData.set({
    ...prev,
    coins: prev.coins + reward.coins,
    xpTotal: prev.xpTotal + reward.xp,
    review: {
      ...prev.review,
      [key]: { lastReviewed: today, reviewCount, ease, nextReview },
    },
    activity: [activity, ...prev.activity],
  });

  return { coins: reward.coins, xp: reward.xp, nextReview, reviewCount };
}

export interface FocusResult {
  coins: number;
  xp: number;
  seconds: number;
}

export function completeFocusSession(seconds: number): FocusResult {
  const prev = appData.get();
  const reward = focusReward(seconds);
  const activity: StudyActivity | null = seconds > 0
    ? createActivity({
        type: "focus",
        count: 1,
        xp: reward.xp,
        coins: reward.coins,
        seconds,
      })
    : null;

  appData.set({
    ...prev,
    coins: prev.coins + reward.coins,
    xpTotal: prev.xpTotal + reward.xp,
    activity: activity ? [activity, ...prev.activity] : prev.activity,
  });

  return { ...reward, seconds };
}

export function exportData(): string {
  return JSON.stringify(appData.get(), null, 2);
}

export function importData(json: string): boolean {
  try {
    appData.set(migrate(JSON.parse(json)));
    if (isBrowser) {
    }
    return true;
  } catch {
    return false;
  }
}

// ---- user topics ------------------------------------------------------------

export function addUserTopic(topic: UserTopic): void {
  const prev = appData.get();
  appData.set({ ...prev, userTopics: [...prev.userTopics, topic] });
}

export function deleteUserTopic(id: string): void {
  const prev = appData.get();
  const topic = prev.userTopics.find((t) => t.id === id);
  const progress = { ...prev.progress };
  const notes = { ...prev.notes };
  if (topic) {
    for (const l of topic.lessons) {
      delete progress[lessonKey(id, l.slug)];
      delete notes[lessonKey(id, l.slug)];
    }
  }
  appData.set({
    ...prev,
    userTopics: prev.userTopics.filter((t) => t.id !== id),
    progress,
    notes,
  });
}

// ---- reward catalog CRUD ----------------------------------------------------

export function addReward(reward: Reward): void {
  const prev = appData.get();
  appData.set({ ...prev, rewards: [...prev.rewards, reward] });
}

export function updateReward(reward: Reward): void {
  const prev = appData.get();
  appData.set({
    ...prev,
    rewards: prev.rewards.map((r) => (r.id === reward.id ? reward : r)),
  });
}

export function deleteReward(id: string): void {
  const prev = appData.get();
  appData.set({ ...prev, rewards: prev.rewards.filter((r) => r.id !== id) });
}

export function resetRewards(): void {
  const prev = appData.get();
  appData.set({ ...prev, rewards: DEFAULT_REWARDS.map((r) => ({ ...r })) });
}

export { lessonKey };
