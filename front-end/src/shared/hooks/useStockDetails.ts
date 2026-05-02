import { useQuery } from "@tanstack/react-query";
import { getStockDetails } from "../services";

function useStockDetails({ itemId }: { itemId: string | null }) {
  return useQuery({
    queryKey: ["stock", "details", itemId],
    queryFn: () => getStockDetails(itemId as string),
    enabled: Boolean(itemId),
    staleTime: 30_000,
  });
}

export default useStockDetails;
