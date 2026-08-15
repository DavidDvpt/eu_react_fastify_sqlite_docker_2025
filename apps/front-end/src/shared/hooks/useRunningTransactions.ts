import { useQuery } from "@tanstack/react-query";

import { useSystemDatas } from "@/shared/hooks";
import { useAppSelector } from "@/store/hooks";
import { selectIsLoggued } from "@/store";
import type { TransactionDto, TransactionBodyDto } from "@eu/types";
import TransactionsApi from "@/shared/services/transactionsApi";

function useRunningTransactions(props: Partial<TransactionBodyDto>) {
  const ts = new TransactionsApi();
  const isLoggued = useAppSelector(selectIsLoggued);
  const runningTransactions = useQuery({
    queryKey: ["running-transactions", props],
    queryFn: () => ts.get(props),
    enabled: isLoggued,
    staleTime: 10_000,
  });
  const {
    items: { filteredItems, isLoading: itemIsLoading, isError: itemIsError },
  } = useSystemDatas();

  const transactionMap = new Map<string, TransactionDto>();

  for (const t of runningTransactions.data ?? []) {
    const itemId = t.entries[0].lot.itemId;
    const item = filteredItems().find((item) => item.id === itemId)!;
    transactionMap.set(itemId, { ...t, item });
  }
  const rows: TransactionDto[] = Array.from(transactionMap.values());

  return {
    rows,
    isLoading: runningTransactions.isLoading || itemIsLoading,
    isError: runningTransactions.isError || itemIsError,
  };
}

export default useRunningTransactions;
