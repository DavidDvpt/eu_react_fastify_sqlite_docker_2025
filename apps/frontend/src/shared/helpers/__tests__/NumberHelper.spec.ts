import { NumberHelper } from "../src/NumberHelper.js";

describe("NumberHelper", () => {
  describe("round", () => {
    it("rounds to two decimals by default", () => {
      expect(NumberHelper.round(12.3456)).toBe(12.35);
    });

    it("rounds using the provided number of decimals", () => {
      expect(NumberHelper.round(12.3456, 3)).toBe(12.346);
    });

    it("supports rounding to an integer", () => {
      expect(NumberHelper.round(12.6, 0)).toBe(13);
    });
  });
});
