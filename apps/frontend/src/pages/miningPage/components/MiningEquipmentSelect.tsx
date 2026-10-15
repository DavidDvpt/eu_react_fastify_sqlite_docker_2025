import AppSelect from "@/shared/components/form/Select/AppSelect";
import type { MiningAvailableLotResponse } from "@/api/generated/react-query/model/miningAvailableLotResponse";
import type { MiningAvailableStackResponse } from "@/api/generated/react-query/model/miningAvailableStackResponse";
import type { ItemViewModel } from "@zod-schemas";
import EnhancerSockets from "./EnhancerSockets";
import MiningItemOption from "./MiningItemOption";

function MiningEquipmentSelect({
  label,
  placeholder,
  lots,
  itemById,
  value,
  onValueChange,
  disabled = false,
  enhancersBySocket,
  target,
  title,
}: {
  label: string;
  placeholder: string;
  lots: MiningAvailableLotResponse[];
  itemById: Map<string, ItemViewModel>;
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  enhancersBySocket: Record<string, MiningAvailableStackResponse[]>;
  target: "FINDER" | "EXCAVATOR";
  title: string;
}) {
  const options = lots
    .filter((lot) => lot.lotId)
    .map((lot) => ({
      value: lot.lotId as string,
      label: (
        <MiningItemOption
          item={itemById.get(lot.itemId)}
          tierLevel={lot.tierLevel}
          quantity={lot.quantity}
        />
      ),
    }));
  const selectedLot = lots.find((lot) => lot.lotId === value);
  const selectedItem = selectedLot ? itemById.get(selectedLot.itemId) : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-text">{label}</label>
      <AppSelect
        value={value}
        onValueChange={onValueChange}
        options={options}
        placeholder={options.length ? placeholder : `Aucun ${label.toLowerCase()} disponible`}
        disabled={disabled || !options.length}
        triggerClassName="bg-input"
      />
      {selectedItem && selectedLot && (
        <EnhancerSockets
          key={selectedLot.lotId}
          tierLevel={selectedLot.tierLevel}
          enhancersBySocket={enhancersBySocket}
          itemById={itemById}
          target={target}
          title={title}
        />
      )}
    </div>
  );
}

export default MiningEquipmentSelect;
