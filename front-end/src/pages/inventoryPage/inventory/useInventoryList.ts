import useGenericFilterParams from "@/shared/components/GenericFilter/useGenericFilterParams";
import { useItems, useStock } from "@/shared/hooks";

import { useMemo } from "react";
import type { ItemInventory } from "./stockTypes";

function useInventoryList() {
  const { params } = useGenericFilterParams();
  const {
    filteredItems,
    isLoading: isItemsLoading,
    isError: isItemsError,
  } = useItems({
    typeId: params.type,
  });
  const {
    data: stock,
    invalidateStock,
    isError: isStockError,
    isLoading: isStockLoading,
  } = useStock();

  const currentStock = useMemo(() => {
    if (filteredItems && stock) {
      return (
        filteredItems.map((item) => {
          const itemStock = stock.find((s) => s.itemId === item.id);
          const totalValue = itemStock?.totalPrice ?? 0;
          return {
            ...item,
            quantity: itemStock?.quantity ?? 0,
            totalValue,
          };
        }) ?? []
      );
    }
    return [];
  }, [filteredItems, stock]);

  const totalStockValue = useMemo(() => {
    if (currentStock) {
      return currentStock.reduce((acc, cur) => acc + cur.totalValue, 0);
    }

    return 0;
  }, [currentStock]);

  const isError = isItemsError || isStockError;
  const isLoading = isItemsLoading || isStockLoading;

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
