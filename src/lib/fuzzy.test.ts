import { describe, expect, it } from "vitest";
import { fuzzyMatchIndices } from "./fuzzy";

describe("fuzzyMatchIndices", () => {
  it("returns increasing title indices for a subsequence match", () => {
    expect(fuzzyMatchIndices("Backend Development", "bdv")).toEqual([0, 6, 10]);
  });

  it("ignores case and whitespace in the query", () => {
    expect(fuzzyMatchIndices("Full-Stack Development", " FSD ")).toEqual([0, 5, 11]);
  });

  it("returns an empty list when the query is not a subsequence", () => {
    expect(fuzzyMatchIndices("REST API Design", "xyz")).toEqual([]);
  });
});
