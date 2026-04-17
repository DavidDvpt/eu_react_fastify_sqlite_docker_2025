import StockMessages from "./StockMessages";
import DetailsItem from "./DetailsItem";
import StockLotInList from "./StockLotList";
import { Panel } from "@/shared/components/Containers";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { StockDetails } from "@/types";

type StockDetailsPanelProps = {
  details: StockDetails | null;
  isLoading: boolean;
  isError: boolean;
  onClose: () => void;
  className?: string;
};

function StockDetailsPanel({
  details,
  isLoading,
  isError,
  onClose,
  className,
}: StockDetailsPanelProps) {
  return (
    <Panel className={`relative ${className ?? ""}`}>
      <Button
        type="button"
        variant="tertiary"
        size="icon"
        className="absolute right-1 top-1 z-10"
        onClick={onClose}
        aria-label="Fermer le panneau de details"
      >
        <X />
      </Button>

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
    </Panel>
  );
}

export default StockDetailsPanel;
