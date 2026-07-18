// eu_react_fastify_docker/front-end/src/shared/components/ItemDetails.tsx
import type { ItemDetailProps, TransactionAction } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Section } from "../Containers";
import { ImageService } from "@/shared/services";
import { FormatTools } from "@/shared/tools";
import { useLocation, useNavigate } from "react-router-dom";

function ItemDetail({ item, onBack = () => {} }: ItemDetailProps) {
  const location = useLocation();
  const navigate = useNavigate();

  if (!item) return null;
  const itemId = item.id;

  const openTransactionModal = (action: TransactionAction) => {
    const query = {
      action,
      itemId,
      ttc: 0,
      quantity: 1,
      closePath: `/inventory/${itemId ?? ""}`,
    };

    const search = new URLSearchParams();
    search.set("transactionModal", JSON.stringify(query));

    navigate({
      pathname: location.pathname,
      search: search.toString(),
    });
  };

  const buyButton = (
    <Button
      onClick={() => openTransactionModal("buy")}
      className="w-[100px]"
      size="sm"
      variant="primary"
    >
      Achat
    </Button>
  );

  const sellButton = (
    <Button
      onClick={() => openTransactionModal("sell")}
      disabled={item.quantity <= 0}
      className="w-[100px]"
      size="sm"
      variant="primary"
    >
      Vente
    </Button>
  );

  return (
    <Section className="flex flex-col gap-4 p-2 m-2">
      <h1 className="m-0 p-0">{item.name}</h1>
      <div className="flex">
        <img
          src={ImageService.getItemImageUrl(item.imageUrlId, "normal") ?? ""}
          alt={item.name}
          style={{
            maxWidth: 120,
            maxHeight: 200,
            width: "auto",
            height: "auto",
            objectFit: "contain",
          }}
        />

        <div className="px-4 gap-1 text-sm">
          <p className="my-0 mb-2">Prix unitaire: {item.value}</p>
          <p className="my-0 mb-2">Quantité: {item.quantity}</p>
          <p className="my-0">
            Valeur: {FormatTools.pedFormat().format(item.totalValue)} Peds
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        {buyButton}
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
