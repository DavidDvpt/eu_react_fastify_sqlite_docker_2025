import StockMessages from "./StockMessages";
import DetailsItem from "./DetailsItem";
import StockLotInList from "./StockLotList";
import { Container } from "@/shared/components/Containers";
import type { StockDetails } from "@/types";

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
    <Container
      type="Panel"
      className={className}
      // title="Details item"
      // headerClassName="items-start text-left"
      // contentClassName="min-h-0 flex-1 overflow-hidden"
    >
      <div className="flex h-full min-h-0 flex-col gap-4 pt-1 pr-1">
        <StockMessages
          isError={isError}
          isLoading={isLoading}
          details={Boolean(details)}
        />

        {details && (
          <>
            <DetailsItem details={details} containerType="Section" />
            <StockLotInList lotList={details.lotsIn} containerType="Section" />
          </>
        )}
      </div>
    </Container>
  );
}

export default StockDetailsPanel;
