import { useMemo } from "react";

import { useListRunningApiV2TransactionsRunningGet } from "@/api/generated/react-query/entropiaManagerAPI";
import { useAppSelector } from "@/store/hooks";
import { selectIsLoggued } from "@/store";
import useSystemDatas from "@/shared/hooks/rqFetchHooks/useSystemDatas";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import type {
  TransactionViewModel,
  TransactionViewModels,
} from "@zod-schemas";

function useTransactionsData() {
  const isLoggued = useAppSelector(selectIsLoggued);
  const {
    items: { filteredItems, isLoading: itemIsLoading, isError: itemIsError },
  } = useSystemDatas();

  const running = useListRunningApiV2TransactionsRunningGet({
    query: {
      queryKey: [...InvalidateQueryAndKeys.getRunningTransactionKey().keys],
      enabled: isLoggued,
      staleTime: 10_000,
    },
  });

  const runningAdapter = useMemo(() => {
    const transactionMap = new Map<string, TransactionViewModel>();
    const runningData = running.data as TransactionViewModels | undefined;
    if (!runningData) return [];

    for (const t of runningData) {
      const item = filteredItems().find((item) => item.id === t.itemId)!;
      const extendedItem = item ? { ...t, item } : t;
      transactionMap.set(extendedItem.id, extendedItem);
    }
    const rows: TransactionViewModel[] = Array.from(transactionMap.values());

    return rows;
  }, [running.data, filteredItems]);

  return {
    running: runningAdapter,
    isLoading: running.isLoading || itemIsLoading,
    isError: running.isError || itemIsError,
  };
}

export default useTransactionsData;
