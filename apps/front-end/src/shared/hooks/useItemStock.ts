import useStockData from "@/shared/hooks/useInventoryData";
import useSystemDatas from "@/shared/hooks/useSystemDatas";
import type { ItemWithStock } from "@/shared/types";
import type { StockQuery } from "@eu/types";
import { useMemo } from "react";

export default function useItemStock({ itemId }: StockQuery = {}) {
  const {
    items: { itemDatas, isLoading: itemsLoading, isError: itemsError },
  } = useSystemDatas();
  const { itemStock, inventoryStock, isItemStockLoading, isItemStockError } =
    useStockData({ itemId });

  const itemsWithStock = useMemo(() => {
    if (!itemDatas || !inventoryStock) return [];

    return itemDatas.map((item) => ({
      ...item,
      stock: inventoryStock[item.id] ?? 0,
    })) as ItemWithStock[];
  }, [inventoryStock, itemDatas]);

  const itemWithStock = useMemo(() => {
    if (!itemDatas || !itemStock) return [];

    return itemDatas
      .filter((f) => f.id === itemId)
      .map((item) => ({
        ...item,
        stock: itemStock[item.id] ?? 0,
      })) as ItemWithStock[];
  }, [itemStock, itemDatas, itemId]);

  return {
    itemsWithStock,
    itemWithStock,
    isLoading: itemsLoading || isItemStockLoading,
    isError: itemsError || isItemStockError,
  };
}
