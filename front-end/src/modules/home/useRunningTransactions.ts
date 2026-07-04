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
    const groupKey = `${line.transactionId}:${line.itemId}`;
    const current = grouped.get(groupKey);
    if (!current) {
      grouped.set(groupKey, {
        groupKey,
        transactionId: line.transactionId,
        itemId: line.itemId,
        itemName: line.itemName,
        quantity: line.quantity,
        tt: line.tt,
        ttc: line.ttc,
        saleStatus: line.saleStatus,
        lineStatus: line.lineStatus,
        transactionLotIds: [line.transactionLotId],
        item: itemsQuery.items.find((item) => item.id === line.itemId) ?? null,
      });
      continue;
    }

    current.quantity += line.quantity;
    current.tt += line.tt;
    current.ttc += line.ttc;
    current.transactionLotIds.push(line.transactionLotId);
  }

  const rows: RunningTransaction[] = Array.from(grouped.values());

  return {
    rows,
    isLoading: runningLinesQuery.isLoading || itemsQuery.isLoading,
    isError: runningLinesQuery.isError || itemsQuery.isError,
  };
}

export default useRunningTransactions;
