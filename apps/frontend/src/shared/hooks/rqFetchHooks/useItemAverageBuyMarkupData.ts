import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import { useGetItemAverageBuyMarkupApiV2ItemsIdAverageBuyMarkupGet } from "@/api/generated/react-query/entropiaManagerAPI";
import type { AverageBuyMarkupResponse } from "@/api/generated/react-query/model";

export default function useItemAverageBuyMarkup({
  itemId,
}: {
  itemId?: string;
}) {
  const { data, ...rest } =
    useGetItemAverageBuyMarkupApiV2ItemsIdAverageBuyMarkupGet(itemId ?? "", {
      query: {
        queryKey: InvalidateQueryAndKeys.getItemAverageBuyMarkupKey(itemId)
          .keys,
        enabled: Boolean(itemId),
        staleTime: 30_000,
      },
    });

  return {
    averageBuyMarkup:
      (itemId ? data : null) as AverageBuyMarkupResponse | null | undefined,
    ...rest,
  };
}
