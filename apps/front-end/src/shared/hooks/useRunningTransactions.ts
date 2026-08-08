import { useQuery } from "@tanstack/react-query";

import { getRunningTransactions } from "@/lib/services/transactionApi";
import { useSystemDatas } from "@/shared/hooks";
import type { RunningTransaction } from "@/shared/types/transactions";

function useRunningTransactions() {
  const runningLinesQuery = useQuery({
    queryKey: ["running-transactions"],
    queryFn: getRunningTransactions,
    staleTime: 10_000,
  });
  const {
    items: { filteredItems, isLoading: itemIsLoading, isError: itemIsError },
  } = useSystemDatas();

  const grouped = new Map<string, RunningTransaction>();
  for (const line of runningLinesQuery.data ?? []) {
    const groupKey = `${line.id}:${line.itemId}`;
    const item = filteredItems().find((item) => item.id === line.itemId);
    const current = grouped.get(groupKey);
    if (!current) {
      grouped.set(groupKey, {
        groupKey,
        id: line.id,
        quantity: line.quantity,
        tt: line.tt,
        fee: line.fee,
        ttc: line.ttc,
        status: line.status,
        item: item ? { ...item, id: line.itemId } : null,
      });
      continue;
    }

    current.quantity += line.quantity;
    current.tt += line.tt;
    current.ttc += line.ttc;
  }

  const rows: RunningTransaction[] = Array.from(grouped.values());

  return {
    rows,
    isLoading: runningLinesQuery.isLoading || itemIsLoading,
    isError: runningLinesQuery.isError || itemIsError,
  };
}

export default useRunningTransactions;
