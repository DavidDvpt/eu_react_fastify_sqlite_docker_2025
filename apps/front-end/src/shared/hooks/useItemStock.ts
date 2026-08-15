import useStockData from "@/shared/hooks/useInventoryStockData";
import useSystemDatas from "@/shared/hooks/useSystemDatas";
import type { ItemWithStock } from "@/shared/types";
import type { ItemDto, StockQuery } from "@eu/types";
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
    if (!itemDatas || !itemStock) return null;

    const i = itemDatas.find((f) => f.id === itemId) as ItemDto;

    if (!i) return null;

    return { ...i, stock: itemStock[i.id] ?? 0 };
  }, [itemStock, itemDatas, itemId]);

  return {
    itemsWithStock,
    itemWithStock,
    isLoading: itemsLoading || isItemStockLoading,
    isError: itemsError || isItemStockError,
  };
}
