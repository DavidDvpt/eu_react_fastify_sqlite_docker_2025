import ItemImage from '@/shared/components/itemImage/ItemImage';
import { formatItemNameWithTier, getItemImageUrl } from '@/shared/helpers';
import type { CockpitItemProps } from './types';

function EquipmentHeader({ item, itemId, tierLevel }: CockpitItemProps) {
  const name = item
    ? formatItemNameWithTier({
        name: item.name,
        hasTierOption: item.type?.hasTierOption,
        isStackable: item.type?.isStackable,
        tierLevel,
      })
    : (itemId ?? 'Item indisponible');

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      {item && (
        <ItemImage
          url={getItemImageUrl(item.imageUrlId, 'normal')}
          alt={name}
          size="small"
          classname="shrink-0"
        />
      )}
      <div className="min-w-0">
        <div className="line-clamp-2 break-words text-sm font-medium text-text">
          {name}
        </div>
      </div>
    </div>
  );
}

export default EquipmentHeader;
