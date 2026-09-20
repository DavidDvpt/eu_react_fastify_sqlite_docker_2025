import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";
import { useInventoryFinancialReportApiV2InventoryFinancialReportGet } from "@/api/generated/react-query/entropiaManagerAPI";
import type { FinancialInventoryReport } from "@zod-schemas";
export default function useFinancialInventoryData() {
  const { data, isLoading, isError } =
    useInventoryFinancialReportApiV2InventoryFinancialReportGet(undefined, {
      query: {
        queryKey: [...InvalidateQueryAndKeys.getInventoryFinancialReportKey().keys],
        staleTime: 30_000,
      },
    });

  // Keep the domain report contract used by the financial sections while the
  // generated model remains the transport-level contract.
  return { data: data as FinancialInventoryReport | undefined, isLoading, isError };
}
