import { useEffect, useMemo, useState } from "react";
import AppSelect from "@/shared/components/form/Select/AppSelect";
import type { MiningAvailableStackResponse } from "@/api/generated/react-query/model/miningAvailableStackResponse";
import type { ItemViewModel } from "@zod-schemas";
import MiningItemOption from "./MiningItemOption";

function MiningAmmoSelector({
  ammo,
  itemById,
  clickCount,
  searchType,
  disabled = false,
  onSelectionChange,
}: {
  ammo: MiningAvailableStackResponse[];
  itemById: Map<string, ItemViewModel>;
  clickCount: number;
  searchType?: number;
  disabled?: boolean;
  onSelectionChange?: (selection?: { itemId: string; quantity: number }) => void;
}) {
  const [selectedItemId, setSelectedItemId] = useState<string>();
  const options = useMemo(
    () => ammo.map((stack) => ({
      value: stack.itemId,
      label: (
        <MiningItemOption
          item={itemById.get(stack.itemId)}
          quantity={stack.quantity}
        />
      ),
    })),
    [ammo, itemById],
  );

  const effectiveSelectedItemId = selectedItemId ?? (options.length === 1 ? options[0].value : undefined);
  const selectedItem = effectiveSelectedItemId
    ? itemById.get(effectiveSelectedItemId)
    : undefined;
  const costPerClick = searchType ? 0.5 * searchType : 0;
  const totalCost = clickCount * costPerClick;
  const requiredQuantity = selectedItem?.value && selectedItem.value > 0
    ? Math.ceil(totalCost / selectedItem.value)
    : 0;

  useEffect(() => {
    const selectedStack = ammo.find((stack) => stack.itemId === effectiveSelectedItemId);
    onSelectionChange?.(
      selectedStack ? { itemId: selectedStack.itemId, quantity: selectedStack.quantity } : undefined,
    );
  }, [ammo, effectiveSelectedItemId, onSelectionChange]);

  return (
    <section className="flex flex-col gap-3 rounded-md border border-border p-4">
      <h3 className="m-0 mb-[10px] text-base font-medium text-text">
        Munitions ({options.length} disponible{options.length > 1 ? "s" : ""})
      </h3>
      <AppSelect
        value={effectiveSelectedItemId}
        options={options}
        onValueChange={setSelectedItemId}
        placeholder={options.length ? "Sélectionner une munition" : "Aucune munition disponible"}
        disabled={disabled || options.length <= 1}
      />
      {selectedItem && (
        <div className="flex flex-wrap gap-6 text-sm text-text-muted">
          <span>Coût par clic : {costPerClick} PED</span>
          <span>Coût total : {totalCost} PED</span>
          <span>Quantité nécessaire : {requiredQuantity}</span>
        </div>
      )}
    </section>
  );
}

export default MiningAmmoSelector;
