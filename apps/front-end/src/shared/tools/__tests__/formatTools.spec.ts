import { describe, expect, it } from "vitest";
import { FormatTools } from "../formatTools";

describe("FormatTools", () => {
  it("formats finite values to an arbitrary number of decimals", () => {
    expect(FormatTools.formatToDecimals(12, 2)).toBe("12.00");
    expect(FormatTools.formatToDecimals("3.14159", 4)).toBe("3.1416");
  });

  it("formats finite values to 5 decimals", () => {
    expect(FormatTools.formatToFiveDecimals(12)).toBe("12.00000");
    expect(FormatTools.formatToFiveDecimals("3.14159")).toBe("3.14159");
  });

  it("returns 0.00000 for invalid values", () => {
    expect(FormatTools.formatToFiveDecimals("abc")).toBe("0.00000");
    expect(FormatTools.formatToFiveDecimals(undefined)).toBe("0.00000");
  });

  it("returns a zero value matching the requested decimals for invalid values", () => {
    expect(FormatTools.formatToDecimals("abc", 2)).toBe("0.00");
    expect(FormatTools.formatToDecimals(undefined, 0)).toBe("0");
  });

  it("trims useless trailing zeros from a formatted decimal string", () => {
    expect(FormatTools.trimTrailingZeros("12.34000")).toBe("12.34");
    expect(FormatTools.trimTrailingZeros("12.00000")).toBe("12");
    expect(FormatTools.trimTrailingZeros("0.00000")).toBe("0");
    expect(FormatTools.trimTrailingZeros("12")).toBe("12");
    expect(FormatTools.trimTrailingZeros("12.00000", 2)).toBe("12.00");
    expect(FormatTools.trimTrailingZeros("12.3", 2)).toBe("12.30");
    expect(FormatTools.trimTrailingZeros("12", 2)).toBe("12.00");
    expect(FormatTools.trimTrailingZeros("0.00000", 2)).toBe("0.00");
  });
});
