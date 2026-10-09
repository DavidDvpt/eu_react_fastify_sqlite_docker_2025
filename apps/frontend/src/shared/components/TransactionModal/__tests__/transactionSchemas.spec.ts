import { describe, expect, it } from "vitest";
import { transactionFormSchema } from "../transactionSchemas";

const baseValues = {
  action: "buy" as const,
  autoCalculation: true,
  quantity: 1,
  fee: 0,
  ttc: 10,
};

describe("transaction tier validation", () => {
  it.each([0, 5, 10])("accepts tier %s", (tierLevel) => {
    expect(
      transactionFormSchema(10, "buy").safeParse({
        ...baseValues,
        tierLevel,
      }).success,
    ).toBe(true);
  });

  it.each([-1, 11, 5.5])("rejects tier %s", (tierLevel) => {
    expect(
      transactionFormSchema(10, "buy").safeParse({
        ...baseValues,
        tierLevel,
      }).success,
    ).toBe(false);
  });

  it("allows a missing tier for non-tierable transactions", () => {
    expect(transactionFormSchema(10, "buy").safeParse(baseValues).success).toBe(
      true,
    );
  });
});
