import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";
import TransactionsApi from "@/shared/services/transactionsApi";
import { useAppSelector } from "@/store/hooks";
import { selectIsLoggued } from "@/store";
import useSystemDatas from "@/shared/hooks/rqFetchHooks/useSystemDatas";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import type { TransactionDto } from "@eu/zod-schemas";

function useTransactionsData() {
  const isLoggued = useAppSelector(selectIsLoggued);
  const ts = new TransactionsApi();

  const {
    items: { filteredItems, isLoading: itemIsLoading, isError: itemIsError },
  } = useSystemDatas();

  const running = useQuery({
    queryKey: [...InvalidateQueryAndKeys.getRunningTransactionKey().keys],
    queryFn: () => ts.running(),
    enabled: isLoggued,
    staleTime: 10_000,
  });

  const runningAdapter = useMemo(() => {
    const transactionMap = new Map<string, TransactionDto>();
    if (!running.data) return [];

    for (const t of running.data ?? []) {
      const item = filteredItems().find((item) => item.id === t.itemId)!;
      const extendedItem = item ? { ...t, item } : t;
      transactionMap.set(extendedItem.id, extendedItem);
    }
    const rows: TransactionDto[] = Array.from(transactionMap.values());

    return rows;
  }, [running.data, filteredItems]);

  return {
    running: runningAdapter,
    isLoading: running.isLoading || itemIsLoading,
    isError: running.isError || itemIsError,
  };
}

export default useTransactionsData;
