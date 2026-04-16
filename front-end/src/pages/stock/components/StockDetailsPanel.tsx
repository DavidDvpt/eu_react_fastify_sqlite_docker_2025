import AppCard from "@/shared/components/AppCard";
import type { StockDetails } from "@/modules/stock";
import { cn } from "@/lib/utils";
import StockMessages from "./StockMessages";
import DetailsItem from "./DetailsItem";
import StockLotInList from "./StockLotList";

type StockDetailsPanelProps = {
  details: StockDetails | null;
  isLoading: boolean;
  isError: boolean;
  className?: string;
};

function StockDetailsPanel({
  details,
  isLoading,
  isError,
  className,
}: StockDetailsPanelProps) {
  return (
    <AppCard
      className={cn("flex h-full min-h-0 flex-col overflow-hidden", className)}
      title="Details item"
      headerClassName="items-start text-left"
      contentClassName="min-h-0 flex-1 overflow-hidden"
      content={
        <div className="flex h-full min-h-0 flex-col gap-4 pt-1 pr-1">
          <StockMessages
            isError={isError}
            isLoading={isLoading}
            details={Boolean(details)}
          />

          {details && (
            <>
              <DetailsItem details={details} />
              <StockLotInList lotList={details.lotsIn} />
            </>
          )}
        </div>
      }
    />
  );
}

export default StockDetailsPanel;
