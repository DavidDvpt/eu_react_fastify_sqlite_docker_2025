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

  const rows: RunningSellItem[] = (runningLinesQuery.data ?? []).map(
    (line) => ({
      ...line,
      item: itemsQuery.items.find((item) => item.id === line.itemId) ?? null,
    }),
  );

  return {
    rows,
    isLoading: runningLinesQuery.isLoading || itemsQuery.isLoading,
    isError: runningLinesQuery.isError || itemsQuery.isError,
  };
}

export default useRunningSells;
