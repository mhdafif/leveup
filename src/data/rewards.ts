// The default reward shop catalog ("uang jajan"). Each reward costs coins and
// maps to a real rupiah value, so redeeming doubles as permission to spend.
// These seed `AppData.rewards` on first run; users edit their own copy in-app.

import type { Reward } from "../lib/types";
export type { Reward };

export const DEFAULT_REWARDS: Reward[] = [
  { id: "boba", name: "Boba or coffee", emoji: "🧋", coinCost: 150, rupiah: 20000 },
  { id: "snack", name: "Favorite snack", emoji: "🍫", coinCost: 250, rupiah: 30000 },
  { id: "movie", name: "Movie night", emoji: "🎬", coinCost: 500, rupiah: 50000 },
  { id: "book", name: "A new book", emoji: "📚", coinCost: 800, rupiah: 100000 },
  { id: "game", name: "Small game", emoji: "🎮", coinCost: 1200, rupiah: 150000 },
  { id: "dinner", name: "Nice dinner out", emoji: "🍜", coinCost: 1800, rupiah: 200000 },
];

/** Informational weekly spend cap (rupiah). The shop warns when you exceed it. */
export const WEEKLY_ALLOWANCE_CAP = 150000;
