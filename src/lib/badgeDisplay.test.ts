import { describe, expect, it } from "vitest";
import { earnedBadgeIcons } from "./badgeDisplay";

describe("earnedBadgeIcons", () => {
  it("returns icons for completed badges in badge definition order", () => {
    expect(earnedBadgeIcons(["century", "first-step", "missing"])).toEqual(["🌱", "💯"]);
  });
});
