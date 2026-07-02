import type { AppData, PersistenceAdapter } from "./types";
import { DAILY_GOAL_DEFAULT } from "../data/config";
import { DEFAULT_REWARDS } from "../data/rewards";

export const STORAGE_KEY = "levelup:data";
export const DATA_VERSION = 3;

const seededRewards = () => DEFAULT_REWARDS.map((r) => ({ ...r }));

export function defaultData(): AppData {
  return {
    version: DATA_VERSION,
    theme: "light",
    progress: {},
    notes: {},
    coins: 0,
    xpTotal: 0,
    badges: [],
    lastStudied: {},
    streak: { current: 0, longest: 0, lastDay: "" },
    dailyGoal: { target: DAILY_GOAL_DEFAULT, date: "", doneToday: 0 },
    redeemed: [],
    rewards: seededRewards(),
    userTopics: [],
    review: {},
    activity: [],
  };
}

// Merge an arbitrary stored blob onto current defaults so older/partial data
// upgrades cleanly. Always stamps the current version.
export function migrate(raw: unknown): AppData {
  const base = defaultData();
  if (!raw || typeof raw !== "object") return base;
  const d = raw as Partial<AppData>;
  return {
    ...base,
    ...d,
    version: DATA_VERSION,
    progress: d.progress ?? base.progress,
    notes: d.notes ?? base.notes,
    badges: d.badges ?? base.badges,
    lastStudied: d.lastStudied ?? base.lastStudied,
    redeemed: d.redeemed ?? base.redeemed,
    streak: { ...base.streak, ...(d.streak ?? {}) },
    dailyGoal: { ...base.dailyGoal, ...(d.dailyGoal ?? {}) },
    // v1 → v2: seed rewards on upgrade; respect an explicitly-empty list.
    rewards: d.rewards ?? base.rewards,
    userTopics: d.userTopics ?? base.userTopics,
    review: d.review ?? base.review,
    activity: d.activity ?? base.activity,
  };
}

type WebStorage = Pick<Storage, "getItem" | "setItem">;

// Resolve storage lazily so this module is safe to import during SSR/build,
// where `localStorage` does not exist.
function resolveStorage(explicit?: WebStorage): WebStorage | null {
  if (explicit) return explicit;
  return typeof localStorage !== "undefined" ? localStorage : null;
}

/**
 * Phase 1 persistence: the browser's localStorage. The store only ever talks to
 * this interface, so a future backend swaps in a different adapter with no other
 * code change.
 */
export function createLocalStorageAdapter(storage?: WebStorage): PersistenceAdapter {
  return {
    load() {
      const s = resolveStorage(storage);
      if (!s) return defaultData();
      try {
        const raw = s.getItem(STORAGE_KEY);
        return migrate(raw ? JSON.parse(raw) : null);
      } catch {
        return defaultData();
      }
    },
    save(data) {
      const s = resolveStorage(storage);
      if (!s) return;
      try {
        s.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        /* quota / unavailable storage — ignore */
      }
    },
  };
}
