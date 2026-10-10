import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import { useGetItemLotsApiV2ItemsIdLotsGet } from "@/api/generated/react-query/entropiaManagerAPI";
import type { GetItemLotsApiV2ItemsIdLotsGetParams } from "@/api/generated/react-query/model";
import type { LotViewModel } from "@zod-schemas";

export default function useItemLotsDatas({ itemId, enabled = true }: { itemId?: string; enabled?: boolean }) {
  const { data, ...rest } = useGetItemLotsApiV2ItemsIdLotsGet(
    itemId ?? "",
    // The backend supports this legacy parameter, but the checked-in OpenAPI
    // document does not expose it yet. Keep sending it until the contract is
    // updated on the backend.
    { hasInitialValue: true } as GetItemLotsApiV2ItemsIdLotsGetParams,
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
