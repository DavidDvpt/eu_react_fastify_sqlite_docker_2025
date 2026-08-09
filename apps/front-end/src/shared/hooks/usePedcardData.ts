import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiStatus } from "@/lib/axios/ApiStatus";

import { useAppSelector } from "@/store/hooks";
import { selectAuthStatus, selectIsLoggued } from "@/store";
import pedcardApi from "@/shared/services/pedCardApi";

const PED_CARD_QUERY_KEY = ["pedCard"];

function usePedCard() {
  const queryClient = useQueryClient();
  const authStatus = useAppSelector(selectAuthStatus);
  const isLoggued = useAppSelector(selectIsLoggued);
  const enabled = isLoggued && authStatus === ApiStatus.FULFILLED;
  const clearOnDisable = true;

  const ps = new pedcardApi();
  const query = useQuery({
    queryKey: PED_CARD_QUERY_KEY,
    queryFn: ps.balance,
    enabled: isLoggued,
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
