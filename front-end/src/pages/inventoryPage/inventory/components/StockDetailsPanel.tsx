import StockMessages from "./StockMessages";
import StockLotInList from "./StockLotList";

import { cn } from "@/lib/utils";
import { Section } from "@/shared/components/Containers";
import type { StockDetailsPanelProps } from "@/shared/types";

import ItemDetail from "@/shared/components/ItemDetail/ItemDetail";
import { useStockDetails } from "@/shared/hooks";
import { useParams } from "react-router-dom";
import useInventoryList from "../useInventoryList";

function StockDetailsPanel({ onClose, className }: StockDetailsPanelProps) {
  const { itemId } = useParams();
  const { getItemData, isError, isLoading } = useInventoryList();
  const {
    data: details,
    isError: isDetailsError,
    isLoading: isDetailsLoading,
  } = useStockDetails({
    itemId: itemId ?? null,
  });
  const item = getItemData(itemId);

  return (
    <Section className={cn("relative min-h-0 p-0", className)} shadow={false}>
      <StockMessages
        isError={isError || isDetailsError}
        isLoading={isLoading || isDetailsLoading}
        details={Boolean(itemId)}
      />

      <ItemDetail onBack={onClose} item={item} />

      <StockLotInList lotList={details?.lotsIn ?? null} />
    </Section>
  );
}

export default StockDetailsPanel;
