import type { Order } from "@eu/types";

export class SortHelper {
  constructor() {}

  static sortByKey<T>(array: T[], key: keyof T, order: Order = "asc") {
    array.sort((a, b) => {
      const av = a[key];
      const bv = b[key];

      if (av == null && bv == null) return 0;
      if (av == null) return 1; // a va à la fin
      if (bv == null) return -1; // b va à la fin

      let comparison = 0;

      if (typeof av === "number" && typeof bv === "number") {
        comparison = av - bv;
      } else if (typeof av === "boolean" && typeof bv === "boolean") {
        comparison = Number(av) - Number(bv);
      } else {
        const aTime = av instanceof Date ? av.getTime() : Date.parse(String(av));
        const bTime = bv instanceof Date ? bv.getTime() : Date.parse(String(bv));
        const bothDates = !Number.isNaN(aTime) && !Number.isNaN(bTime);

        comparison = bothDates
          ? aTime - bTime
          : String(av).localeCompare(String(bv), undefined, { numeric: true });
      }

      return order === "desc" ? -comparison : comparison;
    });
  }
}
