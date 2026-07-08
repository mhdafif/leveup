import { atom } from "nanostores";

/**
 * Focus-timer state, persisted separately from the main appData blob so a
 * running countdown survives full-page navigations (Astro MPA reloads every
 * island) without rewriting the whole save on every tick.
 *
 * The source of truth for a *running* timer is `endsAt` (an absolute epoch ms).
 * Any freshly-mounted island recomputes the live remaining from it, so the
 * timer visibly keeps running after a reload. We only persist on state
 * transitions (start/pause/reset/set) — never on the 1-second display tick.
 */
export interface TimerState {
  /** Chosen preset/custom duration in seconds. */
  selectedSeconds: number;
  running: boolean;
  /** Epoch ms when the countdown reaches zero; null when paused/idle. */
  endsAt: number | null;
  /** Authoritative remaining seconds when paused/idle. */
  remainingSeconds: number;
}

const STORAGE_KEY = "levelup:timer";
const DEFAULT_SECONDS = 1500;
const isBrowser = typeof window !== "undefined";

function defaultState(): TimerState {
  return {
    selectedSeconds: DEFAULT_SECONDS,
    running: false,
    endsAt: null,
    remainingSeconds: DEFAULT_SECONDS,
  };
}

function load(): TimerState {
  if (!isBrowser) return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = { ...defaultState(), ...(JSON.parse(raw) as Partial<TimerState>) };
    // If a running timer already elapsed while the tab was closed, settle it.
    if (parsed.running && parsed.endsAt != null && parsed.endsAt <= Date.now()) {
      return { ...parsed, running: false, endsAt: null, remainingSeconds: 0 };
    }
    return parsed;
  } catch {
    return defaultState();
  }
}

export const timerState = atom<TimerState>(load());

function persist(next: TimerState): void {
  timerState.set(next);
  if (!isBrowser) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota / unavailable storage — ignore */
  }
}

/** Live remaining seconds for display. Never mutates the store. */
export function computeRemaining(state: TimerState, now = Date.now()): number {
  if (state.running && state.endsAt != null) {
    return Math.max(0, Math.round((state.endsAt - now) / 1000));
  }
  return Math.max(0, state.remainingSeconds);
}

export function startTimer(): void {
  const s = timerState.get();
  if (s.running) return;
  const remaining = computeRemaining(s);
  if (remaining <= 0) return;
  persist({ ...s, running: true, endsAt: Date.now() + remaining * 1000, remainingSeconds: remaining });
}

export function pauseTimer(): void {
  const s = timerState.get();
  if (!s.running) return;
  persist({ ...s, running: false, endsAt: null, remainingSeconds: computeRemaining(s) });
}

/** Reset the countdown to `seconds` (defaults to the current selection). */
export function resetTimer(seconds?: number): void {
  const s = timerState.get();
  const target = seconds ?? s.selectedSeconds;
  persist({ selectedSeconds: target, running: false, endsAt: null, remainingSeconds: target });
}

/** Pick a new duration (also resets the countdown to it). */
export function setDuration(seconds: number): void {
  resetTimer(seconds);
}
