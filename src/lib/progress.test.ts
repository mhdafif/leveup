import { describe, expect, it } from "vitest";
import type { ContentIndex } from "./types";
import {
  lessonDone,
  lessonFraction,
  topicFraction,
  isTopicComplete,
  overallFraction,
  totalChecked,
  checklistLenFor,
} from "./progress";

const index: ContentIndex = {
  topics: [
    {
      slug: "ds",
      title: "DS",
      description: "",
      icon: null,
      order: 1,
      lessons: [
        { slug: "arrays", title: "Arrays", order: 1, checklistLen: 4 },
        { slug: "lists", title: "Lists", order: 2, checklistLen: 2 },
      ],
    },
    {
      slug: "sd",
      title: "SD",
      description: "",
      icon: null,
      order: 2,
      lessons: [{ slug: "cache", title: "Cache", order: 1, checklistLen: 4 }],
    },
  ],
};

describe("lessonDone / lessonFraction", () => {
  it("counts only within the checklist length", () => {
    expect(lessonDone([true, true, true, true, true], 4)).toBe(4);
    expect(lessonDone([true, false, true], 4)).toBe(2);
    expect(lessonDone(undefined, 4)).toBe(0);
  });
  it("computes fractions, guarding empty checklists", () => {
    expect(lessonFraction([true, true], 4)).toBe(0.5);
    expect(lessonFraction([], 0)).toBe(0);
  });
});

describe("topic + overall", () => {
  it("aggregates fractions across a topic's lessons", () => {
    const progress = { "ds/arrays": [true, true, false, false], "ds/lists": [true, false] };
    // 2/4 + 1/2 => 3 of 6
    expect(topicFraction(index, progress, "ds")).toBe(0.5);
  });
  it("detects topic completion only when every item is done", () => {
    expect(isTopicComplete(index, { "sd/cache": [true, true, true, true] }, "sd")).toBe(true);
    expect(isTopicComplete(index, { "sd/cache": [true, true, true, false] }, "sd")).toBe(false);
    expect(isTopicComplete(index, {}, "sd")).toBe(false);
  });
  it("computes overall fraction across all topics", () => {
    const progress = { "ds/arrays": [true, true, true, true], "sd/cache": [true, true, false, false] };
    // 4/4 + 0/2 + 2/4 => 6 of 10
    expect(overallFraction(index, progress)).toBe(0.6);
  });
  it("returns 0 fractions when nothing is tracked", () => {
    expect(overallFraction(index, {})).toBe(0);
    expect(topicFraction(index, {}, "ds")).toBe(0);
  });
});

describe("helpers", () => {
  it("counts total checked items across lessons", () => {
    expect(totalChecked({ a: [true, false, true], b: [true] })).toBe(3);
  });
  it("looks up checklist length by key", () => {
    expect(checklistLenFor(index, "ds/arrays")).toBe(4);
    expect(checklistLenFor(index, "ds/missing")).toBe(0);
  });
});
