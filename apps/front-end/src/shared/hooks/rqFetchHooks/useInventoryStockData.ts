import { useQuery } from "@tanstack/react-query";

import InventoryApi from "@/shared/services/inventoryApi";
import type { StockQuery } from "@eu/types";

import useSystemDatas from "@/shared/hooks/rqFetchHooks/useSystemDatas";
import { useMemo } from "react";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import type { ItemWithStock } from "@/shared/types";
import { NumberHelper } from "@eu/helpers";

function useInventoryStockData({ itemId }: StockQuery = {}) {
  const {
    items: { itemDatas, ...restItem },
  } = useSystemDatas();

  const stockApi = new InventoryApi();

  const {
    data: inventoryStock,
    isLoading: isItemsStockLoading,
    isError: isItemsStockError,
  } = useQuery({
    queryKey: [...InvalidateQueryAndKeys.getInventoryStockKey().keys, itemId],
    queryFn: () => stockApi.getStock(),
    staleTime: 30_000,
  });

  const itemsWithStock = useMemo(() => {
    if (!itemDatas || !inventoryStock) return [];

    const map = itemDatas.map((item) => ({
      ...item,
      stock: inventoryStock[item.id] ?? 0,
    })) as ItemWithStock[];

    return map;
  }, [inventoryStock, itemDatas]);

  const inventoryStockValue = useMemo(() => {
    const total = itemDatas?.reduce((t, c) => {
      const s = inventoryStock?.[c.id] ?? 0;
      const v = c.value * s;

      return t + v;
    }, 0);
    return total;
  }, [itemDatas, inventoryStock]);

  return {
    inventoryStock: itemsWithStock,
    inventoryStockValue: inventoryStockValue
      ? NumberHelper.round(inventoryStockValue)
      : 0,
    isInventoryStockLoading: restItem.isLoading || isItemsStockLoading,
    isInventoryStockError: restItem.isError || isItemsStockError,
  };
}

export default useInventoryStockData;
