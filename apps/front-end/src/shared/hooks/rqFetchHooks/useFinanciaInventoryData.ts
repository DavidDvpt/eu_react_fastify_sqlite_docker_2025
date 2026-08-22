import { useQuery } from "@tanstack/react-query";
import InventoryApi from "@/shared/services/inventoryApi";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
export default function useFinancialInventoryData() {
  const api = new InventoryApi();

  const { data, isLoading, isError } = useQuery({
    queryKey: [...InvalidateQueryAndKeys.getInventoryFinancialReportKey().keys],
    queryFn: () => api.getInventoryReport(),
    staleTime: 30_000,
  });

  return { data, isLoading, isError };
}
