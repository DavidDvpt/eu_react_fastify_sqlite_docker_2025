// eu_react_fastify_docker/frontend/src/shared/components/ItemDetails.tsx
import type { ItemDetailProps, TransactionAction } from "@/shared/types";
import { Section } from "../Containers";
import { getItemImageUrl } from "@/shared/helpers/imageUrl";
import { FormatTools } from "@/shared/tools";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useQueryParams } from "@/shared/hooks";
import ItemImage from "@/shared/components/itemImage/ItemImage";
import ItemAverageBuyMarkup from "@/shared/components/ItemAverageBuyMarkup/ItemAverageBuyMarkup";
import useItemAverageBuyMarkup from "@/shared/hooks/rqFetchHooks/useItemAverageBuyMarkupData";
import { formatItemNameWithTier } from "@/shared/helpers";
import IconButton, { IconButtonIcon } from "@/shared/components/IconButton";
import ItemTierEditor from "@/shared/components/ItemDetail/ItemTierEditor";
import ItemDetailsButtons from "@/shared/components/ItemDetail/ItemDetailsButtons";
import ItemDetailInfos from "@/shared/components/ItemDetail/ItemDetailInfos";

function ItemDetail({ item, lot = null, variant = "stock" }: ItemDetailProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { lotId } = useQueryParams<{ lotId?: string }>();

  const hasInvalidLot = Boolean(lotId && (!lot || lot.id !== lotId));
  const [error] = useState<string | null>(() =>
    hasInvalidLot ? "L’instance de l’item n’a pas été trouvée." : null,
  );
  const currentError = hasInvalidLot
    ? "L’instance de l’item n’a pas été trouvée."
    : error;

  const { averageBuyMarkup } = useItemAverageBuyMarkup({ itemId: item?.id });

  const selectedLotId = lotId;
  const isInstanceView = Boolean(selectedLotId);
  const isStoreView = variant === "store";

  const displayName = useMemo(() => {
    if (!item || currentError) return "";
    if (isInstanceView) {
      return formatItemNameWithTier({
        name: item.name,
        hasTierOption: item.type?.hasTierOption,
        isStackable: false,
        tierLevel: lot!.tierLevel,
      });
    }

    return formatItemNameWithTier({
      name: item.name,
      hasTierOption: item.type?.hasTierOption,
      isStackable: item.type?.isStackable,
      tierLevel: isStoreView && item.type?.hasTierOption ? 0 : null,
    });
  }, [item, isInstanceView, lot, isStoreView, currentError]);

  const displayStock = isStoreView || isInstanceView ? 1 : (item?.stock ?? 0);

  const canEditTier =
    !isStoreView && isInstanceView && Boolean(item?.type?.hasTierOption);
  const [isEditingTier, setIsEditingTier] = useState(false);

  const totalValue = useMemo(() => {
    if (!item || currentError) return 0;
    if (isInstanceView) {
      return lot!.ttRemaining;
    }
    return displayStock * item.value;
  }, [item, displayStock, isInstanceView, lot, currentError]);

  if (!item) return null;

  const openTransactionModal = (action: TransactionAction) => {
    const query = {
      action,
      itemId: item.id,
      ttc: 0,
      quantity: 1,
      // Selling MY instance consumes exactly this lot (the backend
      // requires lot_id for non-stackable sales).
      ...(action === "sell" && isInstanceView && selectedLotId
        ? { lotId: selectedLotId }
        : {}),
      closePath: location.pathname,
    };

    const search = new URLSearchParams();
    search.set("transactionModal", JSON.stringify(query));

    navigate({
      pathname: location.pathname,
      search: search.toString(),
    });
  };

  return (
    <Section className="flex flex-col gap-4 p-2 m-2">
      {currentError ? (
        <p className="m-0 p-2 text-sm text-text">{currentError}</p>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <h1 className="m-0 p-0 text-base">{displayName}</h1>
            {canEditTier ? (
              <IconButton
                type="button"
                variant="primary"
                size="icon"
                className="h-8 w-8 rounded-md p-0"
                aria-label="Modifier les tiers"
                title="Modifier les tiers"
                icon={
                  isEditingTier ? IconButtonIcon.Close : IconButtonIcon.Edit
                }
                onClick={() => setIsEditingTier((editing) => !editing)}
              />
            ) : null}
          </div>
          {isEditingTier && canEditTier ? (
            <ItemTierEditor
              key={`${lot?.id ?? "none"}:${lot?.tierLevel ?? "null"}:${lot?.ttRemaining ?? "null"}`}
              itemId={item.id}
              lot={lot}
              canEditTt={!item.isLimited && !item.type?.isStackable}
              itemValue={item.value}
            />
          ) : null}
          <div className="flex">
            <ItemImage
              url={getItemImageUrl(item.imageUrlId, "normal") ?? ""}
              alt={item.name}
              size="medium"
            />

            <ItemDetailInfos item={item} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 border-t border-table-border pt-2 text-xs">
            <span className="text-text">Quantité</span>
            <span className="text-text-muted">{displayStock}</span>
            <span className="text-text">Valeur</span>
            <span className="text-text-muted">
              {FormatTools.pedFormat().format(totalValue)} Ped(s)
            </span>
          </div>
          <ItemAverageBuyMarkup
            averageBuyMarkup={averageBuyMarkup}
            className="border-t border-table-border pt-2"
          />
          {item.description && (
            <p className="m-0 text-xs text-text">{item.description}</p>
          )}
        </>
      )}
      <ItemDetailsButtons
        openTransaction={openTransactionModal}
        canSell={!isStoreView && (item?.stock ?? 0) > 0}
      />
    </Section>
  );
}

export default ItemDetail;
