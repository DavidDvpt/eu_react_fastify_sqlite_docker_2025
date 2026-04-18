import StockMessages from "./StockMessages";
import DetailsItem from "./DetailsItem";
import StockLotInList from "./StockLotList";
import { Panel } from "@/shared/components/Containers";
import type { StockDetailsPanelProps } from "@/types";

function StockDetailsPanel({
  details,
  isLoading,
  isError,
  onClose,
  className,
}: StockDetailsPanelProps) {
  return (
    <Panel className={`relative ${className ?? ""}`}>
      <div className="flex h-full min-h-0 flex-col gap-4 pt-1">
        <StockMessages
          isError={isError}
          isLoading={isLoading}
          details={Boolean(details)}
        />

        {details && (
          <>
            <DetailsItem
              details={details}
              containerType="Section"
              onBack={onClose}
            />
            <StockLotInList lotList={details.lotsIn} containerType="Section" />
          </>
        )}
      </div>
    </Panel>
  );
}

export default StockDetailsPanel;
