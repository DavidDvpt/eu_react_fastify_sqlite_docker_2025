import { useQuery } from "@tanstack/react-query";

import { useAppSelector } from "@/store/hooks";
import { selectIsLoggued } from "@/store";
import pedcardApi from "@/shared/services/pedCardApi";

function usePedCard() {
  const isLoggued = useAppSelector(selectIsLoggued);

  const ps = new pedcardApi();

  const balance = useQuery({
    queryKey: ["pedcard", "balance"],
    queryFn: ps.balance,
    enabled: isLoggued,
    staleTime: Infinity,
    refetchOnMount: true,
  });

  const check = useQuery({
    queryKey: ["pedcard", "check"],
    queryFn: ps.check,
    enabled: isLoggued,
    staleTime: Infinity,
    refetchOnMount: false,
  });

  const canPay = useQuery({
    queryKey: ["pedcard", "can-pay"],
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

export default usePedCard;
