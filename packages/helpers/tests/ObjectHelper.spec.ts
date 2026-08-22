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
});
