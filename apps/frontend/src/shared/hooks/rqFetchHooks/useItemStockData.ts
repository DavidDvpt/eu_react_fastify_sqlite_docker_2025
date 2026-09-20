import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import useSystemDatas from "@/shared/hooks/rqFetchHooks/useSystemDatas";
import { useGetItemStockApiV2ItemsIdStockGet } from "@/api/generated/react-query/entropiaManagerAPI";
import type { ItemViewModel, StockQuery } from "@zod-schemas";
import { useMemo } from "react";

export default function useItemStock({ itemId }: StockQuery = {}) {
  const {
    items: { itemDatas, ...restItem },
  } = useSystemDatas();

  const { data: itemStock, ...rest } = useGetItemStockApiV2ItemsIdStockGet(
    itemId ?? "",
    {
      query: {
        queryKey: InvalidateQueryAndKeys.getItemStockKey(itemId).keys,
        enabled: Boolean(itemId),
        staleTime: 30_000,
      },
    },
  );

  const itemWithStock = useMemo(() => {
    if (!itemDatas || !itemStock) return null;

    const i = itemDatas.find((f) => f.id === itemId) as ItemViewModel;

    if (!i) return null;

    return { ...i, stock: itemStock[i.id] ?? 0 };
  }, [itemStock, itemDatas, itemId]);

  return {
    itemWithStock,
    isLoading: restItem.isLoading || rest.isLoading,
    isError: restItem.isError || rest.isError,
  };
}
