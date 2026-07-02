// Tunable rules for the coin/XP economy and daily goal.

export const COIN_RULES = {
  /** coins + xp awarded per checklist item checked */
  perItem: 1,
  /** bonus when a lesson reaches 100% */
  lessonComplete: 5,
  /** bonus when a topic reaches 100% */
  topicComplete: 20,
  /** streak bonus = min(perStreakDay * streakDays, streakBonusCap) */
  perStreakDay: 2,
  streakBonusCap: 20,
} as const;

/** Default number of checklist items to complete per day. */
export const DAILY_GOAL_DEFAULT = 3;

/** XP needed per level; level = floor(xp / XP_PER_LEVEL) + 1. */
export const XP_PER_LEVEL = 100;

/** Currency used for reward "rupiah value". */
export const CURRENCY = "IDR";
