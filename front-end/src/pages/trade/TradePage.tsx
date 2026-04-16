import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  GenericFilter,
  useGenericObjectFilter,
} from "@/shared/components/GenericFilter";
import { useItems, useTypes } from "@/modules/manage";
import { ImageService } from "@/shared/services/imageService";
import { FormatTools } from "@/shared/tools/formatTools";
import { useStock } from "@/modules/stock";
import type { TradeFilterRow } from "./tradeTypes";
import { TRADE_ITEM_FILTER_MODEL } from "./contants";

function TradePage() {
  const navigate = useNavigate();
  const { id: selectedItemId, action } = useParams<{
    id?: string;
    action?: string;
  }>();

  const { data: stockRows = [], isPending, isError } = useStock();
  const { data: items = [] } = useItems();
  const { data: types = [] } = useTypes();

  const sortedRows = useMemo(
    () => [...stockRows].sort((a, b) => a.name.localeCompare(b.name, "fr")),
    [stockRows],
  );

  const typeById = useMemo(
    () =>
      types.reduce<Record<string, (typeof types)[number]>>((acc, type) => {
        acc[type.id] = type;
        return acc;
      }, {}),
    [types],
  );

  const itemById = useMemo(
    () =>
      items.reduce<Record<string, (typeof items)[number]>>((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {}),
    [items],
  );

  const filterRows = useMemo<TradeFilterRow[]>(
    () =>
      sortedRows.map((row) => {
        const item = itemById[row.itemId];
        const itemType = item ? typeById[item.itemTypeId] : undefined;
        return {
          ...row,
          itemTypeId: item?.itemTypeId ?? null,
          itemTypeName: item?.itemTypeName ?? itemType?.name ?? null,
          categoryId: itemType?.categoryId ?? null,
          categoryName: itemType?.categoryName ?? null,
        };
      }),
    [itemById, sortedRows, typeById],
  );

  const itemFilter = useGenericObjectFilter<TradeFilterRow>({
    items: filterRows,
    model: TRADE_ITEM_FILTER_MODEL,
  });

  const selectedFromFilter =
    typeof itemFilter.filterState.item === "string" &&
    itemFilter.filterState.item
      ? itemFilter.filterState.item
      : null;

  useEffect(() => {
    if (!selectedFromFilter || selectedItemId === selectedFromFilter) {
      return;
    }
    navigate(`/trade/${selectedFromFilter}`);
  }, [navigate, selectedFromFilter, selectedItemId]);

  const selectedItem = useMemo(
    () => filterRows.find((row) => row.itemId === selectedItemId) ?? null,
    [filterRows, selectedItemId],
  );

  function resetTrade() {
    navigate("/trade");
  }

  function goToSell() {
    if (!selectedItemId) return;
    navigate(`/trade/${selectedItemId}/sell`);
  }

  function goToBuy() {
    if (!selectedItemId) return;
    navigate(`/trade/${selectedItemId}/by`);
  }

  return (
    <div className="space-y-2">
      <header className="space-y-2 flex flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-card-title mt-0">Trade</h1>
      </header>

      {!selectedItemId ? (
        <GenericFilter
          model={TRADE_ITEM_FILTER_MODEL}
          filter={itemFilter}
          hasInput={true}
          hasIsLimited={false}
        />
      ) : (
        <section className="shadow-card-inner rounded-md border border-card-inner-border bg-card-inner p-3">
          {isPending ? (
            <p className="text-sm text-card-inner-title m-0">
              Chargement de l'item...
            </p>
          ) : isError ? (
            <p className="text-sm text-danger m-0">
              Impossible de charger les donnees stock.
            </p>
          ) : !selectedItem ? (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-card-inner-title m-0">
                Item introuvable dans le stock courant.
              </p>
              <button
                type="button"
                onClick={resetTrade}
                className="rounded-md border border-button-primary-border bg-button-primary-bg px-3 py-2 text-sm font-medium text-button-primary-text w-[100px] text-center"
              >
                Retour
              </button>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-between gap-4">
              <div className="flex flex-row items-center gap-4 min-w-0">
                {ImageService.getItemImageUrl(
                  selectedItem.imageUrlId,
                  "normal",
                ) ? (
                  <img
                    src={
                      ImageService.getItemImageUrl(
                        selectedItem.imageUrlId,
                        "normal",
                      ) ?? ""
                    }
                    alt={selectedItem.name}
                    className="max-h-[120px] h-auto w-auto shrink-0 rounded object-contain"
                  />
                ) : null}
                <div className="min-w-0">
                  <h2 className="text-card-inner-title text-lg font-semibold m-0">
                    {selectedItem.name}
                  </h2>
                  <p className="text-sm text-card-inner-title mt-2 mb-1">
                    Prix:{" "}
                    {FormatTools.pedFormat().format(selectedItem.unitPrice)} PED
                  </p>
                  <p className="text-sm text-card-inner-title m-0">
                    Stock restant: {selectedItem.quantity}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={goToBuy}
                  className="rounded-md border border-button-primary-border bg-button-primary-bg px-3 py-2 text-sm font-medium text-button-primary-text w-[100px] text-center"
                >
                  Achat
                </button>
                <button
                  type="button"
                  onClick={goToSell}
                  className="rounded-md border border-button-secondary-border bg-button-secondary-bg px-3 py-2 text-sm font-medium text-button-secondary-text w-[100px] text-center"
                >
                  Vente
                </button>
                <button
                  type="button"
                  onClick={resetTrade}
                  className="rounded-md border border-button-primary-border bg-button-primary-bg px-3 py-2 text-sm font-medium text-button-primary-text w-[100px] text-center"
                >
                  Retour
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      <section className="rounded-md border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
        {!selectedItemId
          ? "Selectionne un item pour commencer un trade."
          : action === "sell"
            ? `Mode vente actif sur "${selectedItem?.name ?? selectedItemId}".`
            : action === "by"
              ? `Mode achat actif sur "${selectedItem?.name ?? selectedItemId}".`
              : `Mode trade actif sur l'item "${selectedItem?.name ?? selectedItemId}".`}
      </section>
    </div>
  );
}

export default TradePage;
