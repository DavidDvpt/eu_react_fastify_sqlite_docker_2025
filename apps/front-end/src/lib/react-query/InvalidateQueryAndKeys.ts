import { queryClient } from "@/lib/react-query/queryClient";

type InvalidateObject = { keys: (string | undefined)[] };

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
  static getItemStockKey(itemId?: string): InvalidateObject {
    return { keys: ["stock", "item-stock", itemId] };
  }
  static getInventoryStockKey(): InvalidateObject {
    return { keys: ["stock", "items-stock"] };
  }
  static getInventoryFinancialReportKey(): InvalidateObject {
    return { keys: ["inventory", "financial-report"] };
  }
  static getNexusKey(): InvalidateObject {
    return { keys: ["nexus"] };
  }
  static getItemLotsKey(itemId?: string): InvalidateObject {
    return { keys: ["item-lots", itemId] };
  }

  static async invalidatePedcard() {
    return await queryClient.invalidateQueries({
      queryKey: ["pedcard"],
    });
  }
  static async categoryMutation() {
    return await Promise.all([
      queryClient.invalidateQueries({
        queryKey: this.getCategoriesKey().keys,
      }),
      queryClient.invalidateQueries({
        queryKey: this.getTypesKey().keys,
      }),
      queryClient.invalidateQueries({
        queryKey: this.getItemsKey().keys,
      }),
    ]);
  }
  static async typeMutation() {
    return await Promise.all([
      queryClient.invalidateQueries({
        queryKey: this.getTypesKey().keys,
      }),
      queryClient.invalidateQueries({
        queryKey: this.getItemsKey().keys,
      }),
    ]);
  }
  static async transactionStatusMutation({ itemId }: { itemId?: string }) {
    return await Promise.all([
      this.createTransactionMutation({ itemId }),
      queryClient.invalidateQueries({
        queryKey: this.getRunningTransactionKey().keys,
      }),
      queryClient.invalidateQueries({
        queryKey: this.getInventoryFinancialReportKey().keys,
      }),
    ]);
  }
  static async createTransactionMutation({ itemId }: { itemId?: string }) {
    return await Promise.all([
      queryClient.invalidateQueries({
        queryKey: this.getInventoryStockKey().keys,
      }),
      queryClient.invalidateQueries({
        queryKey: this.getItemStockKey(itemId).keys,
      }),
      queryClient.invalidateQueries({
        queryKey: ["stock", "details", itemId],
      }),
      queryClient.invalidateQueries({
        queryKey: this.getItemLotsKey().keys,
      }),
      queryClient.invalidateQueries({ queryKey: ["pedcard"] }),
      queryClient.invalidateQueries({
        queryKey: this.getInventoryFinancialReportKey().keys,
      }),
    ]);
  }
}
