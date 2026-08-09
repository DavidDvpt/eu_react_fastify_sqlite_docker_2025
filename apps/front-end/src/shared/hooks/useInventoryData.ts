import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import StockApi from "@/shared/services/inventoryApi";
import type { StockQuery } from "@eu/types";
import { ItemsApi } from "@/shared/services";

function useInventoryData({ itemId }: StockQuery = {}) {
  const stockApi = new StockApi();
  const itemApi = new ItemsApi();
  const queryClient = useQueryClient();

  const {
    data: itemStock,
    isLoading: isItemStockLoading,
    isError: isItemStockError,
  } = useQuery({
    queryKey: ["item-stock", itemId],
    queryFn: () => itemApi.getStock(itemId),
    staleTime: 30_000,
  });

  const {
    data: inventoryStock,
    isLoading: isItemsStockLoading,
    isError: isItemsStockError,
  } = useQuery({
    queryKey: ["items-stock"],
    queryFn: () => stockApi.getStock(),
    staleTime: 30_000,
  });

  const invalidateStock = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["item-stock"] }),
    [queryClient],
  );
  const invalidateStocks = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["items-stock"] }),
    [queryClient],
  );

  return {
    invalidateStock,
    invalidateStocks,
    itemStock,
    inventoryStock,
    isItemStockLoading: isItemStockLoading || isItemsStockLoading,
    isItemStockError: isItemStockError || isItemsStockError,
  };
}

export default useInventoryData;
