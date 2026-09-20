import type { StockQuery } from "@zod-schemas";
import { useListInventoryStockApiV2InventoryStockGet } from "@/api/generated/react-query/entropiaManagerAPI";

import useSystemDatas from "@/shared/hooks/rqFetchHooks/useSystemDatas";
import { useMemo } from "react";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import type { ItemWithStock } from "@/shared/types";
import { NumberHelper } from "@/shared/helpers";

function useInventoryStockData({ itemId }: StockQuery = {}) {
  const {
    items: { itemDatas, ...restItem },
  } = useSystemDatas();

  const {
    data: inventoryStock,
    isLoading: isItemsStockLoading,
    isError: isItemsStockError,
  } = useListInventoryStockApiV2InventoryStockGet(undefined, {
    query: {
      queryKey: [...InvalidateQueryAndKeys.getInventoryStockKey().keys, itemId],
      staleTime: 30_000,
    },
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
