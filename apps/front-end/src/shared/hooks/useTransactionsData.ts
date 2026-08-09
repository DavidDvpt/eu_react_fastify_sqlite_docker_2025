import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import TransactionsApi from "@/shared/services/transactionsApi";
import type { TransactionDto, TransactionFormBody } from "@eu/types";
import { useAppSelector } from "@/store/hooks";
import { selectIsLoggued } from "@/store";
import useSystemDatas from "@/shared/hooks/useSystemDatas";

type UseTransactionProps = {
  id?: string;
  action?: string;
  runningProps?: Partial<TransactionFormBody>;
};

function useTransactionsData({
  id,
  action,
  runningProps,
}: UseTransactionProps) {
  const isLoggued = useAppSelector(selectIsLoggued);
  const ts = new TransactionsApi();
  // const { getItemData } = useInventoryList();

  // const selectedItem = getItemData(id);
  // const isTransactionModalOpen = action === "buy" || action === "sell";

  const {
    items: { filteredItems, isLoading: itemIsLoading, isError: itemIsError },
  } = useSystemDatas();

  const running = useQuery({
    queryKey: ["running-transactions", runningProps],
    queryFn: () => ts.get(runningProps),
    enabled: isLoggued,
    staleTime: 10_000,
  });

  const runningAdapter = useMemo(() => {
    const transactionMap = new Map<string, TransactionDto>();
    for (const t of running.data ?? []) {
      const itemId = t.entries[0].lot.itemId;
      const item = filteredItems().find((item) => item.id === itemId)!;
      transactionMap.set(itemId, { ...t, item });
    }
    const rows: TransactionDto[] = Array.from(transactionMap.values());

    return rows;
  }, [running.data, filteredItems]);

  // const transactionItem = useMemo<TransactionFilterRow | null>(() => {
  //   if (!selectedItem) return null;

  //   return {
  //     itemId: selectedItem.id,
  //     imageUrlId: selectedItem.imageUrlId,
  //     name: selectedItem.name,
  //     unitPrice: selectedItem.value,
  //     quantity: selectedItem.quantity,
  //     totalPrice: selectedItem.totalValue,
  //     itemTypeId: selectedItem.typeId ?? null,
  //     itemTypeName: selectedItem.typeName ?? null,
  //     categoryId: selectedItem.categoryId ?? null,
  //     categoryName: selectedItem.categoryName ?? null,
  //   };
  // }, [selectedItem]);

  return {
    running: runningAdapter,
    isLoading: running.isLoading || itemIsLoading,
    isError: running.isError || itemIsError,
    // transactionItem,
    // isTransactionModalOpen,
  };
}

export default useTransactionsData;
