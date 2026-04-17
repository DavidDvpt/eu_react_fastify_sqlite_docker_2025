import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStock } from "@/modules/stock/services/stockApi";

function useStock() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["stock"],
    queryFn: getStock,
    staleTime: 30_000,
  });

  const invalidateStock = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["stock"] }),
    [queryClient],
  );

  return {
    ...query,
    invalidateStock,
  };
}

export default useStock;
