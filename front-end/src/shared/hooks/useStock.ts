import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStock } from "../services";

function useStock() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["items-stock"],
    queryFn: getStock,
    staleTime: 30_000,
  });

  const invalidateStock = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["items-stock"] }),
    [queryClient],
  );

  return {
    ...query,
    invalidateStock,
    getItemStock: (itemId: string) => {
      const stock = query.data?.find((s) => s.itemId === itemId);
      return stock ?? 0;
    },
  };
}

export default useStock;
