// eu_react_fastify_docker/frontend/src/shared/components/ItemDetails.tsx
import type { ItemDetailProps, TransactionAction } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { Section } from "../Containers";
import { getItemImageUrl } from "@/shared/helpers/imageUrl";
import { FormatTools } from "@/shared/tools";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import ItemImage from "@/shared/components/itemImage/ItemImage";
import ItemAverageBuyMarkup from "@/shared/components/ItemAverageBuyMarkup/ItemAverageBuyMarkup";
import useItemAverageBuyMarkup from "@/shared/hooks/rqFetchHooks/useItemAverageBuyMarkupData";
import type { LotViewModel } from "@zod-schemas";
import { Pencil, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUpdateInventoryLotTierApiV2InventoryLotsLotIdTierPatch } from "@/api/generated/react-query/entropiaManagerAPI";
import { LotTierUpdate } from "@/api/generated/zod/model/lotTierUpdate.zod";
import { InvalidateQueryAndKeys } from "@/lib/react-query/InvalidateQueryAndKeys";

function ItemDetail({ item, lots, onBack = () => {} }: ItemDetailProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditingTier, setIsEditingTier] = useState(false);

  const { averageBuyMarkup } = useItemAverageBuyMarkup({ itemId: item?.id });

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

  const canEditTier = Boolean(item.type?.hasTierOption && !item.type.isStackable);

  return (
    <Section className="flex flex-col gap-4 p-2 m-2">
      <div className="flex items-center justify-between gap-2">
        <h1 className="m-0 p-0 text-base">{item.name}</h1>
        {canEditTier ? (
          <Button
            type="button"
            variant="primary"
            size="icon"
            className="h-8 w-8 rounded-md p-0"
            aria-label="Modifier les tiers"
            title="Modifier les tiers"
            onClick={() => setIsEditingTier((editing) => !editing)}
          >
            {isEditingTier ? <X /> : <Pencil />}
          </Button>
        ) : null}
      </div>
      {isEditingTier && canEditTier ? (
        <ItemTierEditor
          key={(lots ?? [])
            .map((lot) => `${lot.id}:${lot.tierLevel ?? "null"}`)
            .join("|")}
          itemId={item.id}
          lots={lots ?? null}
          onClose={() => setIsEditingTier(false)}
        />
      ) : null}
      <div className="flex">
        <ItemImage
          url={getItemImageUrl(item.imageUrlId, "normal") ?? ""}
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
      <ItemAverageBuyMarkup
        averageBuyMarkup={averageBuyMarkup}
        className="border-t border-table-border pt-2"
      />
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

function ItemTierEditor({
  itemId,
  lots,
  onClose,
}: {
  itemId: string;
  lots: LotViewModel[] | null;
  onClose: () => void;
}) {
  const updateTierMutation =
    useUpdateInventoryLotTierApiV2InventoryLotsLotIdTierPatch();
  const [tierValues, setTierValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      (lots ?? []).map((lot) => [lot.id, lot.tierLevel ?? 0]),
    ),
  );
  const [error, setError] = useState<string | null>(null);

  const editableLots = (lots ?? []).filter((lot) => lot.isActive);

  const updateTier = async (lot: LotViewModel) => {
    const tierLevel = tierValues[lot.id] ?? lot.tierLevel ?? 0;
    const parsed = LotTierUpdate.safeParse({ tierLevel });

    if (!parsed.success) {
      setError("Le tier doit être un entier compris entre 0 et 10.");
      return;
    }

    if (lot.tierLevel !== null && lot.tierLevel !== undefined && tierLevel < lot.tierLevel) {
      setError("Le tier ne peut pas diminuer.");
      return;
    }

    setError(null);
    try {
      await updateTierMutation.mutateAsync({
        lotId: lot.id,
        data: parsed.data,
      });
      await InvalidateQueryAndKeys.lotTierMutation(itemId);
    } catch {
      setError("Impossible de modifier le tier.");
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-md border border-table-border p-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold">Modifier les tiers</span>
        <Button type="button" variant="link" size="sm" onClick={onClose}>
          Fermer
        </Button>
      </div>
      {editableLots.length === 0 ? (
        <p className="m-0 text-xs text-text-muted">Aucun lot actif à modifier.</p>
      ) : (
        editableLots.map((lot) => {
          const currentTier = lot.tierLevel ?? 0;
          return (
            <div
              key={lot.id}
              className="flex items-end justify-between gap-2 border-t border-table-border pt-2"
            >
              <div className="text-xs text-text-muted">
                <div>Lot du {FormatTools.dateFrShort(lot.createdAt)}</div>
                <div>Tier actuel : T{currentTier}</div>
              </div>
              <div className="flex items-end gap-2">
                <label className="flex flex-col gap-1 text-xs text-text">
                  Nouveau tier
                  <Input
                    aria-label={`Nouveau tier du lot ${lot.id}`}
                    type="number"
                    min={currentTier}
                    max={10}
                    step={1}
                    value={tierValues[lot.id] ?? currentTier}
                    onChange={(event) =>
                      setTierValues((values) => ({
                        ...values,
                        [lot.id]: event.currentTarget.valueAsNumber,
                      }))
                    }
                  />
                </label>
                <Button
                  type="button"
                  variant="primary"
                  size="icon"
                  aria-label={`Enregistrer le tier du lot ${lot.id}`}
                  disabled={updateTierMutation.isPending}
                  onClick={() => updateTier(lot)}
                >
                  <Save />
                </Button>
              </div>
            </div>
          );
        })
      )}
      {error ? <p className="m-0 text-sm text-destructive-300">{error}</p> : null}
    </div>
  );
}

export default ItemDetail;
