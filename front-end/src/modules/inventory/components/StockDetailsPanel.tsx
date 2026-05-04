import StockMessages from "./StockMessages";

import { Panel } from "@/shared/components/Containers";
import type { StockDetailsPanelProps } from "@/shared/types";

import ItemDetail from "@/shared/components/ItemDetail/ItemDetail";
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
  const item = getItemData(id);

  return (
    <Panel className={`relative ${className ?? ""}`}>
      <StockMessages
        isError={isError}
        isLoading={isLoading}
        details={Boolean(id)}
      />

      <ItemDetail
        onBack={onClose}
        onBuy={() => (item ? onBuy?.(item.id) : undefined)}
        onSell={() => (item ? onSell?.(item.id) : undefined)}
        item={item}
      />
      {/* <StockLotInList lotList={details.lotsIn} containerType="Section" /> */}
    </Panel>
  );
}

export default StockDetailsPanel;
