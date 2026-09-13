// eu_react_fastify_docker/front-end/src/shared/components/ItemDetails.tsx
import type { ItemDetailProps, TransactionAction } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Section } from "../Containers";
import { ImageService } from "@/shared/services";
import { FormatTools } from "@/shared/tools";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import ItemImage from "@/shared/components/itemImage/ItemImage";

function ItemDetail({ item, onBack = () => {} }: ItemDetailProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const totalValue = useMemo(() => {
    if (!item) return 0;
    return item.stock * item.value;
  }, [item]);

  if (!item) return null;

  const itemId = item.id;

  const openTransactionModal = (action: TransactionAction) => {
    const query = {
      action,
      itemId: item.id,
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
      disabled={item.stock <= 0}
      className="w-[100px]"
      size="sm"
      variant="primary"
    >
      Vente
    </Button>
  );

  return (
    <Section className="flex flex-col gap-4 p-2 m-2">
      <h1 className="m-0 p-0 text-base">{item.name}</h1>
      <div className="flex">
        <ItemImage
          url={ImageService.getItemImageUrl(item.imageUrlId, "normal") ?? ""}
          alt={item.name}
          size="medium"
        />

        <div className="grid grid-cols-2 content-start gap-x-4 gap-y-1 px-4 text-xs">
          <span className="text-text">Prix unitaire</span>
          <span className="text-text-muted">
            {FormatTools.pedFormat().format(item.value)} Ped(s)
          </span>
          <span className="text-text">Weight</span>
          <span className="text-text-muted">
            {item.weight === null
              ? "-"
              : FormatTools.formatToThreeDecimals(item.weight)}
          </span>
          <span className="text-text">Non échangeable</span>
          <span className="text-text-muted">
            {item.isUntradeable ? "Oui" : "Non"}
          </span>
          <span className="text-text">Rare</span>
          <span className="text-text-muted">{item.isRare ? "Oui" : "Non"}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 border-t border-table-border pt-2 text-xs">
        <span className="text-text">Quantité</span>
        <span className="text-text-muted">{item.stock}</span>
        <span className="text-text">Valeur</span>
        <span className="text-text-muted">
          {FormatTools.pedFormat().format(totalValue)} Ped(s)
        </span>
      </div>
      {item.description && (
        <p className="m-0 text-xs text-text">{item.description}</p>
      )}
      <div className="flex items-center justify-end gap-2 pt-1">
        {buyButton}
        {sellButton}
        {onBack && (
          <Button
            onClick={onBack}
            className="w-[100px]"
            size="sm"
            variant="secondary"
          >
            Retour
          </Button>
        )}
      </div>
    </Section>
  );
}

export default ItemDetail;
