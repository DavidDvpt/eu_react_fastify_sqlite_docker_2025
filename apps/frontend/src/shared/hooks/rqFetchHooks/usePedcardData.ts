import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/store/hooks";
import { selectIsLoggued } from "@/store";
import pedcardApi from "@/shared/services/pedCardApi";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import {
  useCheckPedcardApiV2PedcardCheckGet,
  useGetBalanceApiV2PedcardBalanceGet,
} from "@/api/generated/react-query/entropiaManagerAPI";

function usePedcard() {
  const isLoggued = useAppSelector(selectIsLoggued);
  const key = InvalidateQueryAndKeys;
  const ps = new pedcardApi();

  const balance = useGetBalanceApiV2PedcardBalanceGet({
    query: {
      queryKey: key.getPedcardBalanceKey().keys,
      enabled: isLoggued,
      staleTime: Infinity,
      refetchOnMount: true,
    },
  });

  const check = useCheckPedcardApiV2PedcardCheckGet({
    query: {
      queryKey: key.getPedcardCheckKey().keys,
      enabled: isLoggued,
      staleTime: Infinity,
      refetchOnMount: false,
    },
  });

  // The current OpenAPI contract requires a `value` parameter, while the
  // existing business flow asks for the authorization without one. Keep this
  // call on the legacy service until the backend contract is clarified.
  const canPay = useQuery({
    queryKey: key.getPedcardCanPayKey().keys,
    queryFn: ps.canPay,
    enabled: isLoggued,
    staleTime: Infinity,
    refetchOnMount: false,
  });

  return {
    balance: balance.data?.balance ?? 0,
    check: check.data?.initialized ?? false,
    canPay: canPay.data?.authorized ?? false,
  };
}

export default usePedcard;
