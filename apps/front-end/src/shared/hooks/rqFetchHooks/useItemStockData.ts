import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import useSystemDatas from "@/shared/hooks/rqFetchHooks/useSystemDatas";
import { ItemsApi } from "@/shared/services";
import type { ItemDto, StockQuery } from "@eu/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function useItemStock({ itemId }: StockQuery = {}) {
  const itemsApi = new ItemsApi();
  const {
    items: { itemDatas, ...restItem },
  } = useSystemDatas();

  const { data: itemStock, ...rest } = useQuery({
    queryKey: InvalidateQueryAndKeys.getItemStockKey(itemId).keys,
    queryFn: () => itemsApi.getStock(itemId),
    staleTime: 30_000,
  });

  const itemWithStock = useMemo(() => {
    if (!itemDatas || !itemStock) return null;

    const i = itemDatas.find((f) => f.id === itemId) as ItemDto;

    if (!i) return null;

    return { ...i, stock: itemStock[i.id] ?? 0 };
  }, [itemStock, itemDatas, itemId]);

  return {
    itemWithStock,
    isLoading: restItem.isLoading || rest.isLoading,
    isError: restItem.isError || rest.isError,
  };
}
