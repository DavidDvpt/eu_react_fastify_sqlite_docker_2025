import { describe, expect, it } from "vitest";
import { SortTools } from "../sortTools";

describe("SortTools", () => {
  it("sorts by name without mutating input", () => {
    const input = [{ name: "zeta" }, { name: "Alpha" }, { name: "beta" }];

    const sorted = SortTools.sortByName(input);

    expect(sorted.map((item) => item.name)).toEqual(["Alpha", "beta", "zeta"]);
    expect(input.map((item) => item.name)).toEqual(["zeta", "Alpha", "beta"]);
  });
});
