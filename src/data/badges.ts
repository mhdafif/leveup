import type { AppData, ContentIndex } from "../lib/types";
import { isTopicComplete, totalChecked } from "../lib/progress";

export interface BadgeDef {
  id: string;
  label: string;
  description: string;
  icon: string;
  earned: (state: AppData, index: ContentIndex) => boolean;
}

export const BADGES: BadgeDef[] = [
  {
    id: "first-step",
    label: "First Step",
    description: "Check off your first item.",
    icon: "🌱",
    earned: (s) => totalChecked(s.progress) >= 1,
  },
  {
    id: "topic-master",
    label: "Topic Master",
    description: "Complete every item in a topic.",
    icon: "🏅",
    earned: (s, index) => index.topics.some((t) => isTopicComplete(index, s.progress, t.slug)),
  },
  {
    id: "streak-7",
    label: "On Fire",
    description: "Reach a 7-day study streak.",
    icon: "🔥",
    earned: (s) => s.streak.current >= 7 || s.streak.longest >= 7,
  },
  {
    id: "century",
    label: "Centurion",
    description: "Check off 100 items in total.",
    icon: "💯",
    earned: (s) => totalChecked(s.progress) >= 100,
  },
  {
    id: "first-reward",
    label: "Treat Yourself",
    description: "Redeem your first reward.",
    icon: "🎁",
    earned: (s) => s.redeemed.length >= 1,
  },
];
