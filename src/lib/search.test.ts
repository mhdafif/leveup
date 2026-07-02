import { describe, expect, it } from "vitest";
import { buildSearchResults, type SearchTopic } from "./search";
import type { UserTopic } from "./types";

const topics: SearchTopic[] = Array.from({ length: 10 }, (_, i) => ({
  slug: `topic-${i + 1}`,
  title: `Topic ${i + 1}`,
  lessons: [
    {
      slug: `lesson-${i + 1}`,
      title: `Lesson ${i + 1}`,
      checklist: [`Checklist ${i + 1}`],
    },
  ],
}));

const userTopics: UserTopic[] = [
  {
    id: "u-custom-abc",
    title: "Custom Topic",
    createdAt: "2026-07-01",
    lessons: [
      {
        slug: "custom-lesson",
        title: "Custom Lesson",
        checklist: ["Custom checklist"],
        body: "Custom body text",
      },
    ],
  },
];

describe("buildSearchResults", () => {
  it("returns no suggestions until query has at least three characters", () => {
    expect(buildSearchResults({ topics, userTopics, query: "" })).toEqual([]);
    expect(buildSearchResults({ topics, userTopics, query: "to" })).toEqual([]);
  });

  it("lists every matching topic and lesson when query has at least three characters", () => {
    const results = buildSearchResults({ topics, userTopics, query: "topic" });

    expect(results).toHaveLength(22);
    expect(results.map((r) => r.url)).toContain("/topics/topic-1");
    expect(results.map((r) => r.url)).toContain("/topics/topic-10/lesson-10");
    expect(results.map((r) => r.url)).toContain("/u?t=u-custom-abc");
    expect(results.map((r) => r.url)).toContain("/u?t=u-custom-abc&l=custom-lesson");
  });

  it("does not cap matching topic and lesson results at eight", () => {
    const results = buildSearchResults({ topics, userTopics: [], query: "topic" });

    expect(results.filter((r) => r.kind === "topic")).toHaveLength(10);
  });

  it("only returns fuzzy matches, not plain substring-only matches", () => {
    const results = buildSearchResults({
      topics: [
        {
          slug: "alpha",
          title: "Alpha",
          lessons: [{ slug: "intro", title: "Intro", checklist: ["learn abc"] }],
        },
      ],
      userTopics: [],
      query: "abc",
    });

    expect(results).toEqual([]);
  });
});
