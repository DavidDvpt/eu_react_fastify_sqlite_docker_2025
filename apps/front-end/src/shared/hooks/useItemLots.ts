import { ItemsApi } from "@/shared/services";
import { useQuery } from "@tanstack/react-query";

export default function useItemLots({ itemId }: { itemId?: string }) {
  const is = new ItemsApi();

  const { data, ...rest } = useQuery({
    queryKey: ["item-lots", itemId],
    queryFn: () => is.getLots({ itemId }),
    staleTime: 30_000,
  });

  return { lots: data, ...rest };
}
