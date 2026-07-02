import { describe, expect, it } from "vitest";
import type { AppData, ContentIndex } from "./types";
import { defaultData } from "./persistence";
import {
  awardForToggle,
  applyStreak,
  bumpDailyGoal,
  evaluateBadges,
  levelForXp,
  todayISO,
} from "./gamification";

const index: ContentIndex = {
  topics: [
    {
      slug: "ds",
      title: "DS",
      description: "",
      icon: null,
      order: 1,
      lessons: [{ slug: "arrays", title: "Arrays", order: 1, checklistLen: 2 }],
    },
  ],
};

function state(over: Partial<AppData> = {}): AppData {
  return { ...defaultData(), ...over };
}

describe("levelForXp", () => {
  it("is 1-based and rises every 100 xp", () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(99)).toBe(1);
    expect(levelForXp(100)).toBe(2);
    expect(levelForXp(250)).toBe(3);
  });
});

describe("awardForToggle", () => {
  it("gives +1 for a plain check", () => {
    const d = awardForToggle(state(), "ds/arrays", 0, true, index);
    expect(d.coins).toBe(1);
    expect(d.lessonCompleted).toBe(false);
  });

  it("adds lesson + topic bonuses when the final item completes a single-lesson topic", () => {
    const prev = state({ progress: { "ds/arrays": [true, false] } });
    const d = awardForToggle(prev, "ds/arrays", 1, true, index);
    // +1 item, +5 lesson, +20 topic
    expect(d.coins).toBe(26);
    expect(d.lessonCompleted).toBe(true);
    expect(d.topicCompleted).toBe(true);
  });

  it("reverses the bonuses on uncheck", () => {
    const prev = state({ progress: { "ds/arrays": [true, true] } });
    const d = awardForToggle(prev, "ds/arrays", 1, false, index);
    expect(d.coins).toBe(-26);
    expect(d.lessonCompleted).toBe(false);
    expect(d.topicCompleted).toBe(false);
  });
});

describe("applyStreak", () => {
  it("starts a streak at 1 with its bonus", () => {
    const r = applyStreak(state(), "2026-06-26");
    expect(r.streak.current).toBe(1);
    expect(r.streak.longest).toBe(1);
    expect(r.bonusCoins).toBe(2);
  });

  it("increments when yesterday was the last study day", () => {
    const prev = state({ streak: { current: 3, longest: 3, lastDay: "2026-06-25" } });
    const r = applyStreak(prev, "2026-06-26");
    expect(r.streak.current).toBe(4);
    expect(r.bonusCoins).toBe(8);
  });

  it("resets to 1 after a gap and never double-counts the same day", () => {
    const gap = applyStreak(state({ streak: { current: 9, longest: 9, lastDay: "2026-06-20" } }), "2026-06-26");
    expect(gap.streak.current).toBe(1);
    expect(gap.streak.longest).toBe(9);

    const same = applyStreak(state({ streak: { current: 5, longest: 5, lastDay: "2026-06-26" } }), "2026-06-26");
    expect(same.streak.current).toBe(5);
    expect(same.bonusCoins).toBe(0);
  });

  it("caps the streak bonus", () => {
    const prev = state({ streak: { current: 49, longest: 49, lastDay: "2026-06-25" } });
    expect(applyStreak(prev, "2026-06-26").bonusCoins).toBe(20);
  });
});

describe("bumpDailyGoal", () => {
  it("increments within the same day and flags reaching the target", () => {
    const prev = state({ dailyGoal: { target: 3, date: "2026-06-26", doneToday: 2 } });
    const r = bumpDailyGoal(prev, "2026-06-26");
    expect(r.dailyGoal.doneToday).toBe(3);
    expect(r.reached).toBe(true);
  });
  it("resets the count on a new day", () => {
    const prev = state({ dailyGoal: { target: 3, date: "2026-06-25", doneToday: 3 } });
    const r = bumpDailyGoal(prev, "2026-06-26");
    expect(r.dailyGoal.doneToday).toBe(1);
    expect(r.reached).toBe(false);
  });
  it("tracks net checked items and floors unchecks at zero", () => {
    const base = state({ dailyGoal: { target: 2, date: "2026-06-26", doneToday: 1 } });
    const checked = bumpDailyGoal(base, "2026-06-26", 1);
    const unchecked = bumpDailyGoal(state({ dailyGoal: checked.dailyGoal }), "2026-06-26", -1);
    const checkedAgain = bumpDailyGoal(state({ dailyGoal: unchecked.dailyGoal }), "2026-06-26", 1);
    const uncheckedAgain = bumpDailyGoal(state({ dailyGoal: checkedAgain.dailyGoal }), "2026-06-26", -1);
    const extraUncheck = bumpDailyGoal(state({ dailyGoal: { target: 2, date: "2026-06-26", doneToday: 0 } }), "2026-06-26", -1);

    expect(checked.dailyGoal.doneToday).toBe(2);
    expect(checked.reached).toBe(true);
    expect(unchecked.dailyGoal.doneToday).toBe(1);
    expect(unchecked.reached).toBe(false);
    expect(checkedAgain.dailyGoal.doneToday).toBe(2);
    expect(checkedAgain.reached).toBe(true);
    expect(uncheckedAgain.dailyGoal.doneToday).toBe(1);
    expect(extraUncheck.dailyGoal.doneToday).toBe(0);
  });
});

describe("evaluateBadges", () => {
  it("awards first-step once an item is checked, not before", () => {
    expect(evaluateBadges(state(), index)).not.toContain("first-step");
    const earned = evaluateBadges(state({ progress: { "ds/arrays": [true] } }), index);
    expect(earned).toContain("first-step");
  });
  it("does not re-award a badge already held", () => {
    const s = state({ progress: { "ds/arrays": [true] }, badges: ["first-step"] });
    expect(evaluateBadges(s, index)).not.toContain("first-step");
  });
  it("awards topic-master when a topic is fully complete", () => {
    const s = state({ progress: { "ds/arrays": [true, true] } });
    expect(evaluateBadges(s, index)).toContain("topic-master");
  });
});

describe("todayISO", () => {
  it("formats a local date as YYYY-MM-DD", () => {
    expect(todayISO(new Date(2026, 5, 6))).toBe("2026-06-06");
  });
});
