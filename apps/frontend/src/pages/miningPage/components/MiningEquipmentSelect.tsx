import AppSelect from '@/shared/components/form/Select/AppSelect';
import SelectRHF from '@/shared/components/form/Select/SelectRHF';
import type { MiningAvailableLotResponse } from '@/api/generated/react-query/model/miningAvailableLotResponse';
import type { MiningAvailableStackResponse } from '@/api/generated/react-query/model/miningAvailableStackResponse';
import type { ItemViewModel } from '@zod-schemas';
import EnhancerSockets from './EnhancerSockets';
import type { SelectedEnhancer } from './EnhancerSockets';
import MiningItemOption from './MiningItemOption';

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
  clickCount,
  searchType,
  onEnhancersChange,
  name,
}: {
  label: string;
  placeholder: string;
  lots: MiningAvailableLotResponse[];
  itemById: Map<string, ItemViewModel>;
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  enhancersBySocket: Record<string, MiningAvailableStackResponse[]>;
  target: 'FINDER' | 'EXCAVATOR';
  title: string;
  clickCount: number;
  searchType?: number;
  onEnhancersChange?: (enhancers: SelectedEnhancer[]) => void;
  name?: string;
}) {
  const options = lots
    .filter((lot) => lot.lotId)
    .map((lot) => {
      const item = itemById.get(lot.itemId);
      const decay = item?.decay
        ? item.decay * (searchType === 3 ? 2 : 1)
        : undefined;

      return {
        value: lot.lotId as string,
        label: (
          <MiningItemOption
            item={item}
            tierLevel={lot.tierLevel}
            quantity={lot.quantity}
            rightContent={
              target === 'FINDER' && decay ? `${decay} PED/clic` : undefined
            }
          />
        ),
      };
    });
  const selectedLot = lots.find((lot) => lot.lotId === value);
  const selectedItem = selectedLot
    ? itemById.get(selectedLot.itemId)
    : undefined;
  const finderDecay = selectedItem?.decay
    ? selectedItem.decay * (searchType === 3 ? 2 : 1)
    : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-text">{label}</label>
      {name ? (
        <SelectRHF
          name={name}
          options={options}
          placeholder={
            options.length
              ? placeholder
              : `Aucun ${label.toLowerCase()} disponible`
          }
          disabled={disabled || !options.length}
          triggerClassName="bg-input"
          onValueChange={onValueChange}
        />
      ) : (
        <AppSelect
          value={value}
          onValueChange={onValueChange}
          options={options}
          placeholder={
            options.length
              ? placeholder
              : `Aucun ${label.toLowerCase()} disponible`
          }
          disabled={disabled || !options.length}
          triggerClassName="bg-input"
        />
      )}
      {target === 'FINDER' && finderDecay && (
        <div className="text-sm text-text-muted">
          Coût total estimé : {Number((clickCount * finderDecay).toFixed(3))}{' '}
          PED
        </div>
      )}
      {selectedItem && selectedLot && (
        <EnhancerSockets
          key={selectedLot.lotId}
          tierLevel={selectedLot.tierLevel}
          enhancersBySocket={enhancersBySocket}
          itemById={itemById}
          target={target}
          title={title}
          onSelectionChange={onEnhancersChange}
        />
      )}
    </div>
  );
}

export default MiningEquipmentSelect;
