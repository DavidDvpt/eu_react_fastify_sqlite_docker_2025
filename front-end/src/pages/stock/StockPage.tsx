import { useState } from "react";
import StockDetailsPanel from "./components/StockDetailsPanel";
import StockPanel from "./components/StockPanel";
import { useStock, useStockDetails } from "@/shared/hooks";

function StockPage() {
  const { data: stockRows = [], isPending, isError } = useStock();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const {
    data: stockDetails = null,
    isPending: detailsPending,
    isError: detailsError,
  } = useStockDetails(selectedItemId);
  const isDetailsLoading = Boolean(selectedItemId) && detailsPending;
  const hasSelectedItem = Boolean(selectedItemId);

  return (
    <div className="mx-auto flex h-full min-h-0 max-h-[100%] w-full max-w items-stretch gap-4 overflow-hidden px-4 py-4">
      <StockPanel
        className={[
          "min-h-0 overflow-hidden transition-all duration-300 ease-in-out",
          hasSelectedItem ? "basis-1/2 max-w-[50%]" : "basis-full max-w-full",
          "max-lg:basis-full max-lg:max-w-full",
        ].join(" ")}
        rows={stockRows}
        isLoading={isPending}
        isError={isError}
        selectedItemId={selectedItemId}
        onSelectItem={setSelectedItemId}
      />
      <div
        className={[
          "min-h-0 overflow-hidden transition-all duration-300 ease-in-out",
          hasSelectedItem
            ? "basis-1/2 max-w-[50%] opacity-100"
            : "pointer-events-none basis-0 max-w-0 opacity-0",
          "max-lg:hidden",
        ].join(" ")}
      >
        <StockDetailsPanel
          className="h-full min-h-0 w-full overflow-hidden"
          details={stockDetails}
          isLoading={isDetailsLoading}
          isError={detailsError}
          onClose={() => setSelectedItemId(null)}
        />
      </div>
    </div>
  );
}

export default StockPage;
