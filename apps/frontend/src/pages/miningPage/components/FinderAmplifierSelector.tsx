import { useEffect, useMemo, useState } from "react";
import AppSelect from "@/shared/components/form/Select/AppSelect";
import type { MiningAvailableLotResponse } from "@/api/generated/react-query/model/miningAvailableLotResponse";
import type { ItemViewModel } from "@zod-schemas";
import MiningItemOption from "./MiningItemOption";

type AmplifierAllocation = {
  ttRemaining: number;
  quantity: number;
  clicks: number;
  isFullTT: boolean;
};

const NO_AMPLIFIER = "__none__";

export type AmplifierSelection = {
  itemId: string;
  lotIds: string[];
  allocations: AmplifierAllocation[];
};

function FinderAmplifierSelector({
  lots,
  itemById,
  clickCount,
  searchType,
  disabled = false,
  onSelectionChange,
}: {
  lots: MiningAvailableLotResponse[];
  itemById: Map<string, ItemViewModel>;
  clickCount: number;
  searchType?: number;
  disabled?: boolean;
  onSelectionChange?: (selection?: AmplifierSelection) => void;
}) {
  const [itemId, setItemId] = useState<string>();
  const amplifierTypes = useMemo(() => {
    const grouped = new Map<string, MiningAvailableLotResponse[]>();
    lots.forEach((lot) => {
      grouped.set(lot.itemId, [...(grouped.get(lot.itemId) ?? []), lot]);
    });
    return [...grouped.entries()].map(([groupItemId, itemLots]) => ({
      item: itemById.get(groupItemId),
      lots: itemLots,
    }));
  }, [itemById, lots]);

  const selectedType = amplifierTypes.find(({ item }) => item?.id === itemId);
  const selectedItem = selectedType?.item;
  const allocations = useMemo(
    () => selectedItem
      ? allocateAmplifiers(selectedType.lots, selectedItem, clickCount, searchType)
      : [],
    [clickCount, searchType, selectedItem, selectedType],
  );
  const allocatedClicks = allocations.reduce(
    (total, row) => total + row.clicks,
    0,
  );

  useEffect(() => {
    onSelectionChange?.(
      selectedItem && selectedType
        ? {
            itemId: selectedItem.id,
            lotIds: selectedType.lots.flatMap((lot) => lot.lotId ? [lot.lotId] : []),
            allocations,
          }
        : undefined,
    );
  }, [allocations, onSelectionChange, selectedItem, selectedType]);

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-text">Finder amplifier</label>
      <div className="flex items-center gap-2">
        <AppSelect
          value={itemId}
          options={[
            { value: NO_AMPLIFIER, label: <span className="flex h-[38px] items-center">Aucun amplificateur</span> },
            ...amplifierTypes.map(({ item, lots: itemLots }) => ({
              value: item?.id ?? itemLots[0].itemId,
              label: <MiningItemOption item={item} quantity={itemLots.length} />,
            })),
          ]}
          onValueChange={(value) => setItemId(value === NO_AMPLIFIER ? undefined : value)}
          placeholder={
            amplifierTypes.length
              ? "Sélectionner un type d’amplificateur"
              : "Aucun amplificateur disponible"
          }
          disabled={disabled || !amplifierTypes.length}
          triggerClassName="h-14"
        />
      </div>
      {selectedItem && (
        <div className="flex flex-col gap-2">
          <p className="m-0 max-w-2xl text-xs leading-4 text-text-muted">
            Full TT d’abord. Les low TT complètent le reliquat uniquement s’ils
            suffisent ; sinon, un full TT supplémentaire est utilisé.
          </p>
          <div className="flex justify-between text-sm text-text-muted">
            <span>{clickCount} clic(s) demandé(s)</span>
            <span>{allocatedClicks} clic(s) couvert(s)</span>
          </div>
          {allocations.length ? (
            <div className="overflow-hidden rounded-md border border-border">
              <div className="grid grid-cols-[minmax(0,1fr)_100px_100px] gap-3 bg-surface-hover px-3 py-2 text-xs font-medium text-text">
                <span>TT restant</span>
                <span>Nombre</span>
                <span>Clics</span>
              </div>
              {allocations.map((allocation, index) => (
                <div
                  key={`${allocation.ttRemaining}-${index}`}
                  className="grid grid-cols-[minmax(0,1fr)_100px_100px] gap-3 border-t border-border px-3 py-2 text-sm text-text-muted"
                >
                  <span>
                    {allocation.isFullTT ? "Full TT" : allocation.ttRemaining}
                  </span>
                  <span>{allocation.quantity}</span>
                  <span>{allocation.clicks}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-sm text-text-muted">
              Aucun amplificateur utilisable pour ces clics.
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function allocateAmplifiers(
  lots: MiningAvailableLotResponse[],
  item: ItemViewModel,
  clickCount: number,
  searchType?: number,
): AmplifierAllocation[] {
  const decay = item.decay
    ? item.decay * (searchType === 3 ? 2 : 1)
    : null;
  if (!decay || decay <= 0 || clickCount <= 0) return [];

  const usableLots = lots.filter((lot) => (lot.ttRemaining ?? 0) > 0);
  const isFullTT = (lot: MiningAvailableLotResponse) =>
    Math.abs((lot.ttRemaining ?? 0) - item.value) < 0.0001;
  const fullTTLots = usableLots.filter(isFullTT);
  const partialLots = usableLots
    .filter((lot) => !isFullTT(lot))
    .sort((left, right) => (left.ttRemaining ?? 0) - (right.ttRemaining ?? 0));
  const fullClicks = Math.floor((fullTTLots[0]?.ttRemaining ?? 0) / decay);
  const partialClicks = partialLots.reduce(
    (total, lot) => total + Math.floor((lot.ttRemaining ?? 0) / decay),
    0,
  );
  let fullQuantity =
    fullClicks > 0
      ? Math.min(fullTTLots.length, Math.floor(clickCount / fullClicks))
      : 0;
  const remainingAfterFullTT = clickCount - fullQuantity * fullClicks;
  const canUsePartialLots = partialClicks >= remainingAfterFullTT;

  if (!canUsePartialLots && fullClicks > 0) {
    fullQuantity = Math.min(
      fullTTLots.length,
      Math.ceil(clickCount / fullClicks),
    );
  }

  const partialAllocations: AmplifierAllocation[] = [];
  let remainingClicks = canUsePartialLots
    ? Math.max(0, clickCount - fullQuantity * fullClicks)
    : 0;

  if (canUsePartialLots) {
    for (const lot of partialLots) {
      if (remainingClicks <= 0) break;
      const availableClicks = Math.floor((lot.ttRemaining ?? 0) / decay);
      const clicks = Math.min(availableClicks, remainingClicks);
      if (clicks <= 0) continue;

      partialAllocations.push({
        ttRemaining: lot.ttRemaining ?? 0,
        quantity: 1,
        clicks,
        isFullTT: false,
      });
      remainingClicks -= clicks;
    }
  }
  const result: AmplifierAllocation[] = [];

  if (fullQuantity) {
    result.push({
      ttRemaining: item.value,
      quantity: fullQuantity,
      clicks: fullQuantity * fullClicks,
      isFullTT: true,
    });
  }

  return [...result, ...partialAllocations];
}

export default FinderAmplifierSelector;
