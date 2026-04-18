import type { StockDetails } from "@/types";
import { Container } from "@/shared/components/Containers";
import type { ContainerType } from "@/types/containerTypes";
import { ImageService } from "@/shared/services/imageService";
import { FormatTools } from "@/shared/tools/formatTools";
import { TradeActions } from "@/shared/components";
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

  const image = ImageService.getItemImageUrl(details.imageUrlId, "normal");
  const price = FormatTools.pedFormat().format(details.unitPrice);

  return (
    <Container type={containerType} className="flex min-h-0 flex-col gap-4">
      <div className="flex flex-row">
        <div className="w-[40%]">
          {image ? (
            <img
              src={image}
              alt={details.name}
              className="h-[120px] w-auto rounded object-contain"
            />
          ) : null}
        </div>
        <div className="w-[59%] flex flex-col">
          <h3 className="text-base font-semibold text-card-inner-title mt-0">
            {details.name}
          </h3>

          <dl className="grid grid-cols-2 gap-2 text-smtext-card-inner-title ">
            <dt>Prix unitaire</dt>
            <dd>{price} PED</dd>
            <dt>Stock restant</dt>
            <dd>{details.quantity}</dd>
          </dl>
        </div>
      </div>
      <TradeActions
        direction="row"
        className="mt-auto"
        onBuy={goToBuy}
        onSell={goToSell}
        onBack={onBack}
        disableBuy={!details}
        disableSell={!details || details.quantity <= 0}
      />
    </Container>
  );
}

export default DetailsItem;
