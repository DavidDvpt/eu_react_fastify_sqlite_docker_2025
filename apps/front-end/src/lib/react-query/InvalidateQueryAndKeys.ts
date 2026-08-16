import { queryClient } from "@/lib/react-query/queryClient";

type InvalidateObject = { keys: string[] };

export class InvalidateQueryAndKeys {
  static getCategoriesKey(): InvalidateObject {
    return { keys: ["categories"] };
  }
  static getTypesKey(): InvalidateObject {
    return { keys: ["types"] };
  }
  static getItemsKey(): InvalidateObject {
    return { keys: ["items"] };
  }
  static getPedcardBalanceKey(): InvalidateObject {
    return { keys: ["pedcard", "balance"] };
  }
  static getPedcardCheckKey(): InvalidateObject {
    return { keys: ["pedcard", "check"] };
  }
  static getPedcardCanPayKey(): InvalidateObject {
    return { keys: ["pedcard", "can-pay"] };
  }
  static getRunningTransactionKey(): InvalidateObject {
    return { keys: ["running-transactions"] };
  }
  static getItemStockKey(): InvalidateObject {
    return { keys: ["stock", "item-stock"] };
  }
  static getInventoryStockKey(): InvalidateObject {
    return { keys: ["stock", "items-stock"] };
  }

  static async invalidatePedcard() {
    await queryClient.invalidateQueries({
      queryKey: ["pedcard"],
    });
  }
}
