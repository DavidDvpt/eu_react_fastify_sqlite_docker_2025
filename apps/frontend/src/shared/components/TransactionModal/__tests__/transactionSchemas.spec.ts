import { describe, expect, it } from "vitest";
import { transactionFormSchema } from "../transactionSchemas";

const baseValues = {
  action: "buy" as const,
  isAuction: true,
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

describe("transaction auction vs free validation", () => {
  it("accepts integer TTC in auction mode", () => {
    expect(
      transactionFormSchema(10, "buy").safeParse({ ...baseValues, ttc: 25 })
        .success,
    ).toBe(true);
  });

  it("rejects decimal TTC in auction mode", () => {
    const result = transactionFormSchema(10, "buy").safeParse({
      ...baseValues,
      ttc: 12.5,
    });
    expect(result.success).toBe(false);
  });

  it("accepts 5-decimal TTC in free mode", () => {
    expect(
      transactionFormSchema(10, "buy").safeParse({
        ...baseValues,
        isAuction: false,
        ttc: 12.34567,
      }).success,
    ).toBe(true);
  });

  it("accepts comma decimals in free mode", () => {
    const result = transactionFormSchema(10, "buy").safeParse({
      ...baseValues,
      isAuction: false,
      ttc: "12,5",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.ttc).toBe(12.5);
  });

  it("accepts comma decimals for the fee", () => {
    const result = transactionFormSchema(10, "buy").safeParse({
      ...baseValues,
      isAuction: false,
      fee: "1,25",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.fee).toBe(1.25);
  });

  it("rejects 6-decimal TTC in free mode", () => {
    expect(
      transactionFormSchema(10, "buy").safeParse({
        ...baseValues,
        isAuction: false,
        ttc: 12.345678,
      }).success,
    ).toBe(false);
  });

  it("accepts per-lot values for a multi-lot non-stackable buy", () => {
    expect(
      transactionFormSchema(10, "buy", { isStackable: false, itemValue: 22 }).safeParse({
        ...baseValues,
        isAuction: false,
        quantity: 1,
        tt: 15,
        ttc: 16.5,
        lotCount: 10,
      }).success,
    ).toBe(true);
  });

  it("rejects non-stackable TT above item value", () => {
    expect(
      transactionFormSchema(1, "buy", { isStackable: false, itemValue: 22 }).safeParse({
        ...baseValues,
        tt: 23,
      }).success,
    ).toBe(false);
  });

  it("rejects auction multi-lot non-stackable buys", () => {
    expect(
      transactionFormSchema(1, "buy", { isStackable: false, itemValue: 22 }).safeParse({
        ...baseValues,
        tt: 22,
        lotCount: 2,
      }).success,
    ).toBe(false);
  });

  it("rejects bulk buy whose TTC does not split evenly", () => {
    const result = transactionFormSchema(
      10,
      "buy",
      { isStackable: false },
    ).safeParse({
      ...baseValues,
      isAuction: false,
      quantity: 3,
      ttc: 100.00001,
    });
    expect(result.success).toBe(false);
  });

  it("rejects bulk buy when not allowed", () => {
    const result = transactionFormSchema(
      10,
      "buy",
      { isStackable: false, allowBulk: false },
    ).safeParse({
      ...baseValues,
      isAuction: false,
      quantity: 10,
      ttc: 242,
    });
    expect(result.success).toBe(false);
  });
});
