// Shared types used across server (content build) and client (store/logic).

export interface LessonMeta {
  slug: string;
  title: string;
  order: number;
  checklistLen: number;
  checklist: string[];
  difficulty?: "easy" | "medium" | "hard";
  estMinutes?: number;
}

export interface TopicMeta {
  slug: string;
  title: string;
  description: string;
  icon: string | null;
  order: number;
  lessons: LessonMeta[];
}

/** The structure islands fetch from /content-index.json to compute progress. */
export interface ContentIndex {
  topics: TopicMeta[];
}

export interface Redemption {
  id: string;
  date: string; // ISO date
  coinCost: number;
  rupiah: number;
}

export type ActivityType = "checklist" | "review" | "focus";
export type ReviewEase = "hard" | "good" | "easy";

export interface StudyActivity {
  id: string;
  date: string; // YYYY-MM-DD
  type: ActivityType;
  topicSlug?: string;
  lessonSlug?: string;
  count: number;
  xp: number;
  coins: number;
  seconds?: number;
}

export interface ReviewState {
  lastReviewed?: string;
  reviewCount: number;
  ease?: ReviewEase;
  nextReview: string;
}

/** A reward in the shop. Seeded from DEFAULT_REWARDS; user-editable. */
export interface Reward {
  id: string;
  name: string;
  emoji: string;
  coinCost: number;
  rupiah: number;
}

/** A subtopic inside an uploaded topic; body is raw markdown rendered client-side. */
export interface UserLesson {
  slug: string;
  title: string;
  checklist: string[];
  body: string;
  estMinutes?: number;
  difficulty?: "easy" | "medium" | "hard";
}

/** A topic uploaded by the user and stored in localStorage. */
export interface UserTopic {
  id: string; // `u-<slug>-<rand>`
  title: string;
  icon?: string;
  description?: string;
  createdAt: string; // ISO
  lessons: UserLesson[];
}

/** Everything persisted to the single `levelup:data` localStorage key. */
export type DifficultyMode = "easy" | "expert";

export interface AppData {
  version: number;
  theme: "light" | "dark";
  /** Global content difficulty: "easy" swaps in beginner lesson variants + inline abbreviation meanings. */
  difficultyMode: DifficultyMode;
  /** key `${topicSlug}/${lessonSlug}` -> per-checklist-item booleans */
  progress: Record<string, boolean[]>;
  /** key `${topicSlug}/${lessonSlug}` -> personal note text */
  notes: Record<string, string>;
  coins: number;
  xpTotal: number;
  badges: string[];
  /** topicSlug -> ISO date last studied */
  lastStudied: Record<string, string>;
  streak: { current: number; longest: number; lastDay: string };
  dailyGoal: { target: number; date: string; doneToday: number };
  redeemed: Redemption[];
  weeklyAllowanceCap?: number;
  /** Reward shop catalog; seeded from DEFAULT_REWARDS, user-editable. */
  rewards: Reward[];
  /** Topics uploaded by the user (markdown saved in storage). */
  userTopics: UserTopic[];
  /** key `${topicSlug}/${lessonSlug}` -> review scheduling state */
  review: Record<string, ReviewState>;
  /** Append-only local history for calendar/stats. */
  activity: StudyActivity[];
}

export interface PersistenceAdapter {
  load(): AppData;
  save(data: AppData): void;
}
