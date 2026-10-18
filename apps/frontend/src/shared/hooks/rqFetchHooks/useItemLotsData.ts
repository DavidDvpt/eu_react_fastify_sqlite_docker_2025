import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import { useGetItemLotsApiV2ItemsIdLotsGet } from "@/api/generated/react-query/entropiaManagerAPI";
import type { GetItemLotsApiV2ItemsIdLotsGetParams } from "@/api/generated/react-query/model";
import type { LotViewModel } from "@zod-schemas";

export default function useItemLotsDatas({ itemId, enabled = true }: { itemId?: string; enabled?: boolean }) {
  const { data, ...rest } = useGetItemLotsApiV2ItemsIdLotsGet(
    itemId ?? "",
    // Only request active lots: the selected inventory instance must be
    // present here for its tier to be shown and edited in the detail panel.
    { isActive: true } as GetItemLotsApiV2ItemsIdLotsGetParams,
    {
      query: {
        queryKey: InvalidateQueryAndKeys.getItemLotsKey(itemId).keys,
        enabled: Boolean(itemId) && enabled,
        staleTime: 30_000,
      },
    },
  );

  return {
    lots: (itemId ? data : null) as LotViewModel[] | null | undefined,
    ...rest,
  };
}
