// eu_react_fastify_docker/front-end/src/shared/components/ItemDetails.tsx
import type { ItemDetailProps } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Section } from "../Containers";
import { ImageService } from "@/shared/services";
import { FormatTools } from "@/shared/tools";

function ItemDetail({
  item,
  onBack = () => {},
  onBuy = () => {},
  onSell = () => {},
}: ItemDetailProps) {
  if (!item) return null;

  const tradeButton = (
    <Button
      onClick={onBuy}
      disabled={!onBuy}
      className="w-[100px]"
      size="sm"
      variant="primary"
    >
      Achat
    </Button>
  );

  const sellButton = (
    <Button
      onClick={onSell}
      disabled={item.quantity <= 0 || !onSell}
      className="w-[100px]"
      size="sm"
      variant="primary"
    >
      Vente
    </Button>
  );

  return (
    <Section className="flex flex-col gap-2">
      <h1>{item.name}</h1>
      <div className="flex">
        <img
          src={ImageService.getItemImageUrl(item.imageUrlId, "normal") ?? ""}
          alt={item.name}
        />

        <div className="px-4 gap-2">
          <p className="my-0 mb-2">Prix unitaire: {item.value}</p>
          <p className="my-0 mb-2">Quantité: {item.quantity}</p>
          <p className="my-0">
            Valeur: {FormatTools.pedFormat().format(item.totalValue)} Peds
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        {tradeButton}
        {sellButton}
        {onBack && (
          <Button
            onClick={onBack}
            className="w-[100px]"
            size="sm"
            variant="primary"
          >
            Retour
          </Button>
        )}
      </div>
    </Section>
  );
}

export default ItemDetail;
