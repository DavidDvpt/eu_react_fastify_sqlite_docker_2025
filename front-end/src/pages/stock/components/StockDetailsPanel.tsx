import StockMessages from "./StockMessages";

import { Panel } from "@/shared/components/Containers";
import type { StockDetailsPanelProps } from "@/shared/types";

import ItemDetail from "@/shared/components/ItemDetail/ItemDetail";
import { useParams } from "react-router-dom";
import useInventoryList from "../useInventoryList";

function StockDetailsPanel({ onClose, className }: StockDetailsPanelProps) {
  const { id } = useParams();
  const { getItemData, isError, isLoading } = useInventoryList();

  return (
    <Panel className={`relative ${className ?? ""}`}>
      <StockMessages
        isError={isError}
        isLoading={isLoading}
        details={Boolean(id)}
      />

      <ItemDetail onBack={onClose} item={getItemData(id)} />
      {/* <StockLotInList lotList={details.lotsIn} containerType="Section" /> */}
    </Panel>
  );
}

export default StockDetailsPanel;
