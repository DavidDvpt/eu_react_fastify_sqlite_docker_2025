import type { StockDetails } from "@/shared/types";

import type { ContainerType } from "@/shared/types/containerTypes";
import { TradeItemDetails } from "@/shared/components";
import { useNavigate } from "react-router-dom";
import { Panel } from "@/shared/components/Containers";

interface DetailsItemProps {
  details: StockDetails | null;
  containerType: ContainerType;
  onBack: () => void;
}

function ItemStockDetails({ details, onBack }: DetailsItemProps) {
  const navigate = useNavigate();

  function goToBuy() {
    if (!details) return;
    navigate(`/trade/${details.itemId}/buy`);
  }

  function goToSell() {
    if (!details) return;
    navigate(`/trade/${details.itemId}/sell`);
  }

  if (!details) return null;

  return (
    <Panel>
      <TradeItemDetails
        itemName={details.name}
        imageUrlId={details.imageUrlId}
        unitPrice={details.unitPrice}
        quantity={details.quantity}
        onBuy={goToBuy}
        onSell={goToSell}
        onBack={onBack}
        disableBuy={!details}
        disableSell={!details || details.quantity <= 0}
        actionsDirection="row"
        actionsPlacement="bottom"
      />
    </Panel>
  );
}

export default ItemStockDetails;
