import { useStock } from "@/modules/stock";
import StockPanel from "./components/StockPanel";

function StockPage() {
  const {
    data: stockRows = [],
    isPending,
    isError,
  } = useStock();

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-[1100px] justify-start px-4 py-4">
      <StockPanel rows={stockRows} isLoading={isPending} isError={isError} />
    </div>
  );
}

export default StockPage;
