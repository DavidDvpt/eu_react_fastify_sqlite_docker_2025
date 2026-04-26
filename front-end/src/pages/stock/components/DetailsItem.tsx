import type { StockDetails } from "@/shared/types";
import { Container } from "@/shared/components/Containers";
import type { ContainerType } from "@/shared/types/containerTypes";
import { TradeItemDetails } from "@/shared/components";
import { useNavigate } from "react-router-dom";

interface DetailsItemProps {
  details: StockDetails | null;
  containerType: ContainerType;
  onBack: () => void;
}

function DetailsItem({ details, containerType, onBack }: DetailsItemProps) {
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
    <Container type={containerType} className="flex min-h-0 flex-col gap-4">
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
    </Container>
  );
}

export default DetailsItem;
