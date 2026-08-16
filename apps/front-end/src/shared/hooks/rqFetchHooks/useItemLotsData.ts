import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import { ItemsApi } from "@/shared/services";
import { useQuery } from "@tanstack/react-query";

export default function useItemLotsDatas({ itemId }: { itemId?: string }) {
  const is = new ItemsApi();

  const { data, ...rest } = useQuery({
    queryKey: InvalidateQueryAndKeys.getItemLotsKey().keys,
    queryFn: () => is.getLots({ itemId }),
    staleTime: 30_000,
  });

  return { lots: data, ...rest };
}
