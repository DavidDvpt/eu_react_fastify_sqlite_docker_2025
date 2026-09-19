import { SortHelper } from "../src/SortHelper.js";

describe("SortHelper", () => {
  describe("sortByKey", () => {
    it("sorts numbers in ascending order by default", () => {
      const items = [{ value: 3 }, { value: 1 }, { value: 2 }];

      SortHelper.sortByKey(items, "value");

      expect(items).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }]);
    });

    it("sorts strings in descending order when requested", () => {
      const items = [{ label: "alpha" }, { label: "charlie" }, { label: "bravo" }];

      SortHelper.sortByKey(items, "label", "desc");

      expect(items).toEqual([
        { label: "charlie" },
        { label: "bravo" },
        { label: "alpha" },
      ]);
    });

    it("keeps null and undefined values at the end", () => {
      const items = [
        { value: null },
        { value: 2 },
        { value: undefined },
        { value: 1 },
      ];

      SortHelper.sortByKey(items, "value");

      expect(items).toEqual([
        { value: 1 },
        { value: 2 },
        { value: null },
        { value: undefined },
      ]);
    });

    it("sorts dates chronologically", () => {
      const items = [
        { createdAt: "2024-02-01" },
        { createdAt: "2024-01-15" },
        { createdAt: "2024-01-31" },
      ];

      SortHelper.sortByKey(items, "createdAt");

      expect(items).toEqual([
        { createdAt: "2024-01-15" },
        { createdAt: "2024-01-31" },
        { createdAt: "2024-02-01" },
      ]);
    });
  });
});
