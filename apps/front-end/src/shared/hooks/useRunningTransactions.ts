import { useQuery } from "@tanstack/react-query";

import { getRunningTransactionLines } from "@/lib/services/transaction.api";
import { useItems } from "@/shared/hooks";
import type { RunningTransaction } from "@/shared/types/transactions";

function useRunningTransactions() {
  const runningLinesQuery = useQuery({
    queryKey: ["running-sell-lines"],
    queryFn: getRunningTransactionLines,
    staleTime: 10_000,
  });
  const itemsQuery = useItems({ prefillSelect: true });

  const grouped = new Map<string, RunningTransaction>();
  for (const line of runningLinesQuery.data ?? []) {
    const groupKey = `${line.id}:${line.itemId}`;
    const item = itemsQuery.items.find((item) => item.id === line.itemId);
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
    isLoading: runningLinesQuery.isLoading || itemsQuery.isLoading,
    isError: runningLinesQuery.isError || itemsQuery.isError,
  };
}

export default useRunningTransactions;
