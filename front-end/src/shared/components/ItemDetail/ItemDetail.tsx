// eu_react_fastify_docker/front-end/src/shared/components/ItemDetails.tsx
import type { Item } from "@/shared/types";
import type { ContainerType } from "@/shared/types/containerTypes";
import { Button } from "@/components/ui/button";
import Section from "../Containers/Section";

interface ItemDetailsProps {
  item: (Item & { stock: number }) | null;
  containerType: ContainerType;
  onBack?: () => void;
  onBuy?: () => void;
  onSell?: () => void;
  variant?: "trade" | "stock" | "manage"; // Nouvelle prop pour la variante
}

function ItemDetails({
  item,
  containerType,
  onBack = () => {},
  onBuy = () => {},
  onSell = () => {},
}: ItemDetailsProps) {
  if (!item) return null;

  const tradeButton = (
    <Button onClick={onBuy} disabled={!onBuy}>
      Achat
    </Button>
  );

  const sellButton = (
    <Button onClick={onSell} disabled={item.quantity <= 0 || !onSell}>
      Vente
    </Button>
  );

  return (
    <Section type={containerType}>
      <div className="flex flex-col gap-2">
        {/* Affiche les détails de l'item */}
        <h1>{item.name}</h1>
        <img src={`/images/${item.imageUrlId}.png`} alt={item.name} />
        <p>Prix unitaire: {item.unitPrice}</p>
        <p>Quantité: {item.quantity}</p>
      </div>
      <div className="flex items-center justify-between">
        {onBack && (
          <Button onClick={onBack} className="mr-2">
            Retour
          </Button>
        )}
        {tradeButton}
        {sellButton}
      </div>
    </Section>
  );
}

export default ItemDetails;
