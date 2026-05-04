import { useMemo } from "react";

import useInventoryList from "@/modules/inventory/useInventoryList";
import type { TransactionFilterRow } from "./types";

type UseTransactionProps = {
  id?: string;
  action?: string;
};

function useTransaction({ id, action }: UseTransactionProps) {
  const { getItemData } = useInventoryList();
  const selectedItem = getItemData(id);
  const isTransactionModalOpen = action === "buy" || action === "sell";

  const transactionItem = useMemo<TransactionFilterRow | null>(() => {
    if (!selectedItem) return null;

    return {
      itemId: selectedItem.id,
      imageUrlId: selectedItem.imageUrlId,
      name: selectedItem.name,
      unitPrice: selectedItem.value,
      quantity: selectedItem.quantity,
      totalPrice: selectedItem.totalValue,
      itemTypeId: selectedItem.typeId ?? null,
      itemTypeName: selectedItem.typeName ?? null,
      categoryId: selectedItem.categoryId ?? null,
      categoryName: selectedItem.categoryName ?? null,
    };
  }, [selectedItem]);

  return { transactionItem, isTransactionModalOpen };
}

export default useTransaction;
