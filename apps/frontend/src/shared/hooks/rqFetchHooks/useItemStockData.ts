import { useQueryClient } from "@tanstack/react-query";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import useSystemDatas from "@/shared/hooks/rqFetchHooks/useSystemDatas";
import { useGetItemStockApiV2ItemsIdStockGet } from "@/api/generated/react-query/entropiaManagerAPI";
import type { StockLineResponse } from "@/api/generated/react-query/model";
import type { ItemViewModel, StockQuery } from "@zod-schemas";
import { getLotsForItem, getStockForItem, groupStockLines } from "@/shared/helpers";
import { useMemo } from "react";

/**
 * Item stock lines, seeded from the inventory list cache when available.
 * Opening details from the list renders instantly with no extra request;
 * a direct deep link (empty cache) fetches normally.
 */
export default function useItemStock({ itemId }: StockQuery = {}) {
  const {
    items: { itemDatas, ...restItem },
  } = useSystemDatas();
  const queryClient = useQueryClient();

  const seedFromInventoryCache = () => {
    const cached = queryClient.getQueryData<StockLineResponse[]>(
      InvalidateQueryAndKeys.getInventoryStockKey().keys,
    );
    return cached?.filter((line) => line.itemId === itemId);
  };

  const { data: itemStock, ...rest } = useGetItemStockApiV2ItemsIdStockGet(
    itemId ?? "",
    {
      query: {
        queryKey: InvalidateQueryAndKeys.getItemStockKey(itemId).keys,
        enabled: Boolean(itemId),
        staleTime: 30_000,
        initialData: seedFromInventoryCache,
        initialDataUpdatedAt: () =>
          queryClient.getQueryState(
            InvalidateQueryAndKeys.getInventoryStockKey().keys,
          )?.dataUpdatedAt,
      },
    },
  );

  const groupedStocks = useMemo(() => groupStockLines(itemStock), [itemStock]);

  const itemWithStock = useMemo(() => {
    if (!itemDatas || !itemStock) return null;

    const i = itemDatas.find((f) => f.id === itemId) as ItemViewModel;

    if (!i) return null;

    return {
      ...i,
      stock: getStockForItem(groupedStocks, i.id),
      lots: getLotsForItem(groupedStocks, i.id),
    };
  }, [groupedStocks, itemDatas, itemId, itemStock]);

  return {
    itemWithStock,
    isLoading: restItem.isLoading || rest.isLoading,
    isError: restItem.isError || rest.isError,
  };
}
