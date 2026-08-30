import { ObjectHelper } from "../src/ObjectHelper.js";

describe("ObjectHelper", () => {
  describe("omitUndefined", () => {
    it("removes keys with undefined values", () => {
      expect(
        ObjectHelper.omitUndefined({
          id: 1,
          name: "Alice",
          email: undefined,
        }),
      ).toEqual({
        id: 1,
        name: "Alice",
      });
    });

    it("keeps falsy values that are not undefined", () => {
      expect(
        ObjectHelper.omitUndefined({
          active: false,
          count: 0,
          label: "",
          meta: null,
          optional: undefined,
        }),
      ).toEqual({
        active: false,
        count: 0,
        label: "",
        meta: null,
      });
    });
  });

  describe("snakeToCamelKeys", () => {
    it("converts snake_case keys to camelCase", () => {
      expect(
        ObjectHelper.snakeToCamelKeys({
          item_id: 1,
          item_name: "Alice",
          is_active: true,
        }),
      ).toEqual({
        itemId: 1,
        itemName: "Alice",
        isActive: true,
      });
    });

    it("converts nested objects and arrays", () => {
      expect(
        ObjectHelper.snakeToCamelKeys({
          item_data: {
            created_at: "2026-08-30",
            lot_list: [
              {
                lot_id: 10,
                unit_price: 42.5,
              },
            ],
          },
        }),
      ).toEqual({
        itemData: {
          createdAt: "2026-08-30",
          lotList: [
            {
              lotId: 10,
              unitPrice: 42.5,
            },
          ],
        },
      });
    });

    it("converts Prisma Decimal-like values with Number", () => {
      class Decimal {
        constructor(private readonly value: string) {}

        valueOf(): number {
          return Number(this.value);
        }
      }

      expect(
        ObjectHelper.snakeToCamelKeys({
          total_price: new Decimal("12.34"),
          quantity: 2,
        }),
      ).toEqual({
        totalPrice: 12.34,
        quantity: 2,
      });
    });
  });
});
