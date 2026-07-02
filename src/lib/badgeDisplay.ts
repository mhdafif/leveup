import { BADGES } from "../data/badges";

export function earnedBadgeIcons(_badgeIds: string[]): string[] {
  const earned = new Set(_badgeIds);
  return BADGES.filter((badge) => earned.has(badge.id)).map((badge) => badge.icon);
}
