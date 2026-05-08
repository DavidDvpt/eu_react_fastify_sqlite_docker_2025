import { useQuery } from "@tanstack/react-query";

import { getRunningSellLines } from "@/modules/transactions/transaction.api";
import { useItems } from "@/shared/hooks";
import type { RunningSellItem } from "./types";

function useRunningSells() {
  const runningLinesQuery = useQuery({
    queryKey: ["running-sell-lines"],
    queryFn: getRunningSellLines,
    staleTime: 10_000,
  });
  const itemsQuery = useItems({ prefillSelect: true });

  const grouped = new Map<string, RunningSellItem>();
  for (const line of runningLinesQuery.data ?? []) {
    const groupKey = `${line.sessionId}:${line.itemId}`;
    const current = grouped.get(groupKey);
    if (!current) {
      grouped.set(groupKey, {
        groupKey,
        sessionId: line.sessionId,
        itemId: line.itemId,
        itemName: line.itemName,
        quantity: line.quantity,
        tt: line.tt,
        ttc: line.ttc,
        saleStatus: line.saleStatus,
        lineStatus: line.lineStatus,
        sessionLineIds: [line.sessionLineId],
        item: itemsQuery.items.find((item) => item.id === line.itemId) ?? null,
      });
      continue;
    }

    current.quantity += line.quantity;
    current.tt += line.tt;
    current.ttc += line.ttc;
    current.sessionLineIds.push(line.sessionLineId);
  }

  const rows: RunningSellItem[] = Array.from(grouped.values());

  return {
    rows,
    isLoading: runningLinesQuery.isLoading || itemsQuery.isLoading,
    isError: runningLinesQuery.isError || itemsQuery.isError,
  };
}

export default useRunningSells;
