import { describe, expect, it } from "vitest";
import { rupiah, pct, dateID } from "./format";

describe("rupiah", () => {
  it("formats whole rupiah with dot thousands and no decimals", () => {
    expect(rupiah(20000)).toBe("Rp 20.000");
    expect(rupiah(150000)).toBe("Rp 150.000");
    expect(rupiah(0)).toBe("Rp 0");
  });
});

describe("pct", () => {
  it("rounds a 0..1 fraction to a whole percent", () => {
    expect(pct(0)).toBe(0);
    expect(pct(1)).toBe(100);
    expect(pct(0.676)).toBe(68);
    expect(pct(0.244)).toBe(24);
  });
});

describe("dateID", () => {
  it("formats an ISO date and includes the year", () => {
    expect(dateID("2026-06-26")).toContain("2026");
  });
  it("returns empty string for invalid input", () => {
    expect(dateID("not-a-date")).toBe("");
  });
});
