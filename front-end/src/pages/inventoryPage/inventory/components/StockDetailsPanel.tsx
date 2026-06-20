import StockMessages from "./StockMessages";
import StockLotInList from "./StockLotList";

import { cn } from "@/lib/utils";
import { Panel } from "@/shared/components/Containers";
import type { StockDetailsPanelProps } from "@/shared/types";

import ItemDetail from "@/shared/components/ItemDetail/ItemDetail";
import { useStockDetails } from "@/shared/hooks";
import { useParams } from "react-router-dom";
import useInventoryList from "../useInventoryList";

function StockDetailsPanel({
  onClose,
  onBuy,
  onSell,
  className,
}: StockDetailsPanelProps) {
  const { id } = useParams();
  const { getItemData, isError, isLoading } = useInventoryList();
  const {
    data: details,
    isError: isDetailsError,
    isLoading: isDetailsLoading,
  } = useStockDetails({
    itemId: id ?? null,
  });
  const item = getItemData(id);

  return (
    <Panel className={cn("relative min-h-0 gap-2", className)}>
      <StockMessages
        isError={isError || isDetailsError}
        isLoading={isLoading || isDetailsLoading}
        details={Boolean(id)}
      />

      <ItemDetail
        onBack={onClose}
        onBuy={() => (item ? onBuy?.(item.id) : undefined)}
        onSell={() => (item ? onSell?.(item.id) : undefined)}
        item={item}
      />
      <StockLotInList lotList={details?.lotsIn ?? null} />
    </Panel>
  );
}

export default StockDetailsPanel;
