import { describe, expect, it } from "vitest";
import { FormatTools } from "../formatTools";

describe("FormatTools", () => {
  it("formats finite values to 5 decimals", () => {
    expect(FormatTools.formatToFiveDecimals(12)).toBe("12.00000");
    expect(FormatTools.formatToFiveDecimals("3.14159")).toBe("3.14159");
  });

  it("returns 0.00000 for invalid values", () => {
    expect(FormatTools.formatToFiveDecimals("abc")).toBe("0.00000");
    expect(FormatTools.formatToFiveDecimals(undefined)).toBe("0.00000");
  });
});
