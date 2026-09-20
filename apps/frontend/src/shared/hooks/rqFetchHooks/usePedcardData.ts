import { useAppSelector } from "@/store/hooks";
import { selectIsLoggued } from "@/store";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import {
  useCanPayApiV2PedcardCanPayGet,
  useCheckPedcardApiV2PedcardCheckGet,
  useGetBalanceApiV2PedcardBalanceGet,
} from "@/api/generated/react-query/entropiaManagerAPI";

function usePedcard({ canPayValue }: { canPayValue?: number } = {}) {
  const isLoggued = useAppSelector(selectIsLoggued);
  const key = InvalidateQueryAndKeys;

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

  const canPay = useCanPayApiV2PedcardCanPayGet(
    { value: canPayValue ?? 0 },
    {
      query: {
        queryKey: [...key.getPedcardCanPayKey().keys, canPayValue],
        enabled: isLoggued && canPayValue !== undefined,
        staleTime: Infinity,
        refetchOnMount: false,
      },
    },
  );

  return {
    balance: balance.data?.balance ?? 0,
    check: check.data?.initialized ?? false,
    canPay: canPay.data?.authorized ?? false,
  };
}

export default usePedcard;
