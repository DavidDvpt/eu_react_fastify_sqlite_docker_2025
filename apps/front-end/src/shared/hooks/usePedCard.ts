import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiStatus } from "@/lib/axios/ApiStatus";
import { getPedCard } from "@/lib/services";
import { selectAuthStatus, selectIsLoggued } from "@/modules/auth";
import { useAppSelector } from "@/store/hooks";

const PED_CARD_QUERY_KEY = ["pedCard"];

function usePedCard() {
  const queryClient = useQueryClient();
  const authStatus = useAppSelector(selectAuthStatus);
  const isLoggued = useAppSelector(selectIsLoggued);
  const enabled = isLoggued && authStatus === ApiStatus.FULFILLED;
  const clearOnDisable = true;

  const query = useQuery({
    queryKey: PED_CARD_QUERY_KEY,
    queryFn: getPedCard,
    enabled,
    staleTime: Infinity,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (!enabled && clearOnDisable) {
      queryClient.removeQueries({ queryKey: PED_CARD_QUERY_KEY });
    }
  }, [clearOnDisable, enabled, queryClient]);

  const status = !enabled
    ? ApiStatus.IDLE
    : query.isError
      ? ApiStatus.REJECTED
      : query.isPending || query.isFetching
        ? ApiStatus.PENDING
        : ApiStatus.FULFILLED;

  return {
    ...query,
    pedCard: query.data ?? null,
    status,
    enabled,
    invalidatePedCard: () =>
      queryClient.invalidateQueries({ queryKey: PED_CARD_QUERY_KEY }),
  };
}

export default usePedCard;
