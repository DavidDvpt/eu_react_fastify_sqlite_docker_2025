import { describe, expect, it } from "vitest";
import ArrayTools from "../arrayTools";

describe("ArrayTools", () => {
  it("sorts by name without mutating input", () => {
    const input = [{ name: "zeta" }, { name: "Alpha" }, { name: "beta" }];

    const sorted = ArrayTools.sortByName(input);

    expect(sorted.map((item) => item.name)).toEqual(["Alpha", "beta", "zeta"]);
    expect(input.map((item) => item.name)).toEqual(["zeta", "Alpha", "beta"]);
  });

  it("sorts items with missing names as empty strings", () => {
    const input = [{ name: "Bravo" }, {}, { name: "alpha" }];

    const sorted = ArrayTools.sortByName(input);

    expect(sorted.map((item) => item.name ?? null)).toEqual([
      null,
      "alpha",
      "Bravo",
    ]);
  });

  it("indexes items by id", () => {
    const input = [
      { id: "a1", name: "Alpha" },
      { id: "b2", name: "Beta" },
    ];

    const indexed = ArrayTools.indexById(input);

    expect(indexed).toEqual({
      a1: { id: "a1", name: "Alpha" },
      b2: { id: "b2", name: "Beta" },
    });
  });

  it("stringifies numeric ids when indexing", () => {
    const input = [
      { id: 1, name: "One" },
      { id: 2, name: "Two" },
    ];

    const indexed = ArrayTools.indexById(input);

    expect(indexed["1"]).toEqual({ id: 1, name: "One" });
    expect(indexed["2"]).toEqual({ id: 2, name: "Two" });
  });
});
