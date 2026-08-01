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

      return String(av).localeCompare(String(bv));
    });
  }
}
