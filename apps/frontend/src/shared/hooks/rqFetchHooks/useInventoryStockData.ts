import { useListInventoryStockApiV2InventoryStockGet } from "@/api/generated/react-query/entropiaManagerAPI";

import useSystemDatas from "@/shared/hooks/rqFetchHooks/useSystemDatas";
import { useMemo } from "react";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import type { ItemWithStock } from "@/shared/types";
import {
  getLotsForItem,
  getItemStockValue,
  getStockForItem,
  groupStockLines,
  NumberHelper,
} from "@/shared/helpers";

function useInventoryStockData() {
  const {
    items: { itemDatas, ...restItem },
  } = useSystemDatas();

  const {
    data: inventoryStock,
    isLoading: isItemsStockLoading,
    isError: isItemsStockError,
  } = useListInventoryStockApiV2InventoryStockGet(undefined, {
    query: {
      queryKey: InvalidateQueryAndKeys.getInventoryStockKey().keys,
      staleTime: 30_000,
    },
  });

  const groupedStocks = useMemo(
    () => groupStockLines(inventoryStock),
    [inventoryStock],
  );

  const itemsWithStock = useMemo(() => {
    if (!itemDatas) return [];

    const map = itemDatas.map((item) => ({
      ...item,
      stock: getStockForItem(groupedStocks, item.id),
      lots: getLotsForItem(groupedStocks, item.id),
    })) as ItemWithStock[];

    return map;
  }, [groupedStocks, itemDatas]);

  const inventoryStockValue = useMemo(() => {
    const total = itemDatas?.reduce((t, c) => {
      const s = getStockForItem(groupedStocks, c.id);
      const lots = getLotsForItem(groupedStocks, c.id);
      const v = getItemStockValue({
        ...c,
        stock: s,
        lots,
      });

      return t + v;
    }, 0);
    return total;
  }, [itemDatas, groupedStocks]);

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
