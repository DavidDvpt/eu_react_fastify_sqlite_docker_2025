import { useQuery } from "@tanstack/react-query";

import StockApi from "@/shared/services/inventoryApi";
import type { StockQuery } from "@eu/types";
import { ItemsApi } from "@/shared/services";
import useSystemDatas from "@/shared/hooks/useSystemDatas";
import { useMemo } from "react";

function useInventoryStockData({ itemId }: StockQuery = {}) {
  const { items } = useSystemDatas();

  const stockApi = new StockApi();
  const itemApi = new ItemsApi();

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
    queryKey: ["items-stock", itemId],
    queryFn: () => stockApi.getStock(),
    staleTime: 30_000,
  });

  const inventoryStockValue = useMemo(() => {
    const total = items.data?.reduce((t, c) => {
      const s = inventoryStock?.[c.id] ?? 0;
      const v = c.value * s;

      return t + v;
    }, 0);
    return total;
  }, [items, inventoryStock]);
  return {
    itemStock,
    inventoryStock,
    inventoryStockValue,
    isItemStockLoading: isItemStockLoading || isItemsStockLoading,
    isItemStockError: isItemStockError || isItemsStockError,
  };
}

export default useInventoryStockData;
