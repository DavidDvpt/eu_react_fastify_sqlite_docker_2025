import { useQuery } from "@tanstack/react-query";

import { useSystemDatas } from "@/shared/hooks";
import type { TransactionWithItem } from "@/shared/types/transactions";
import { useAppSelector } from "@/store/hooks";
import { selectIsLoggued } from "@/store";
import type { TransactionFormBody } from "@eu/types";
import TransactionsApi from "@/lib/services/transactionsApi";

function useRunningTransactions(props: Partial<TransactionFormBody>) {
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

  const transactionMap = new Map<string, TransactionWithItem>();

  for (const t of runningTransactions.data ?? []) {
    const itemId = t.entries[0].lot.itemId;
    const item = filteredItems().find((item) => item.id === itemId)!;
    const current = transactionMap.get(t.id);
    if (!current) {
      transactionMap.set(t.id, {
        ...t,
        item: item,
      });
    } else {
      current.tt += t.tt;
      current.ttc += t.ttc;
    }
  }
  const rows: TransactionWithItem[] = Array.from(transactionMap.values());

  return {
    rows,
    isLoading: runningTransactions.isLoading || itemIsLoading,
    isError: runningTransactions.isError || itemIsError,
  };
}

export default useRunningTransactions;
