import { useState } from "react";
import { useStock, useStockDetails } from "@/modules/stock";
import StockDetailsPanel from "./components/StockDetailsPanel";
import StockPanel from "./components/StockPanel";

function StockPage() {
  const {
    data: stockRows = [],
    isPending,
    isError,
  } = useStock();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const {
    data: stockDetails = null,
    isPending: detailsPending,
    isError: detailsError,
  } = useStockDetails(selectedItemId);

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-[1280px] items-stretch justify-between overflow-hidden px-4 py-4">
      <StockPanel
        className="w-[49%] min-h-0 overflow-hidden max-lg:w-full"
        rows={stockRows}
        isLoading={isPending}
        isError={isError}
        selectedItemId={selectedItemId}
        onSelectItem={setSelectedItemId}
      />
      <StockDetailsPanel
        className="w-[49%] min-h-0 overflow-hidden max-lg:hidden"
        details={stockDetails}
        isLoading={detailsPending}
        isError={detailsError}
      />
    </div>
  );
}

export default StockPage;
