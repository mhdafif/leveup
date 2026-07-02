export function focusReward(seconds: number): { coins: number; xp: number } {
  const units = Math.floor(Math.max(0, seconds) / 300);
  return { coins: units, xp: units };
}
