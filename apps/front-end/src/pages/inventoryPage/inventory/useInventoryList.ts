import useGenericFilterParams from "@/shared/components/GenericFilter/useGenericFilterParams";
import { useStock, useSystemDatas } from "@/shared/hooks";

import { useMemo } from "react";
import type { ItemInventory } from "./stockTypes";

function useInventoryList() {
  const { params } = useGenericFilterParams();
  const {
    items: { filteredItems, isError: isItemsError, isLoading: isItemLoading },
  } = useSystemDatas();
  const {
    data: stock,
    invalidateStock,
    isError: isStockError,
    isLoading: isStockLoading,
  } = useStock();

  const currentStock = useMemo(() => {
    if (filteredItems && stock) {
      return (
        filteredItems({ typeId: params.type, categoryId: params.category }).map(
          (item) => {
            const itemStock = stock.find((s) => s.itemId === item.id);
            const totalValue = itemStock?.totalPrice ?? 0;
            return {
              ...item,
              quantity: itemStock?.quantity ?? 0,
              totalValue,
            };
          },
        ) ?? []
      );
    }
    return [];
  }, [filteredItems, stock, params]);

  const totalStockValue = useMemo(() => {
    if (currentStock) {
      return currentStock.reduce((acc, cur) => acc + cur.totalValue, 0);
    }

    return 0;
  }, [currentStock]);

  const isError = isItemsError || isStockError;
  const isLoading = isItemLoading || isStockLoading;

  const getItemData = useMemo(
    () => (itemId?: string) =>
      currentStock.find((item) => item.id === itemId) as ItemInventory | null,
    [currentStock],
  );
  return {
    isError,
    isLoading,
    currentStock,
    invalidateStock,
    selectedItem: params.item,
    totalStockValue,
    getItemData,
  };
}

export default useInventoryList;
