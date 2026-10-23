import { formatItemNameWithTier, getItemImageUrl } from '@/shared/helpers';
import ItemImage from '@/shared/components/itemImage/ItemImage';
import type { ItemViewModel } from '@zod-schemas';

type MiningResultItemOptionProps = {
  item: ItemViewModel;
  onClick: () => void;
};

function MiningResultItemOption({
  item,
  onClick,
}: MiningResultItemOptionProps) {
  const name = formatItemNameWithTier({
    name: item.name,
    hasTierOption: item.type?.hasTierOption,
    isStackable: item.type?.isStackable,
  });

  return (
    <div
      role="button"
      tabIndex={0}
      className="flex w-full cursor-pointer items-center gap-2 rounded-none bg-input px-2 py-0 text-left text-xs text-white shadow-none hover:bg-surface-hover"
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <ItemImage
        url={getItemImageUrl(item.imageUrlId, 'normal')}
        alt={name}
        size="small"
        classname="shrink-0"
      />
      <span className="min-w-0 truncate">{name}</span>
    </div>
  );
}

export default MiningResultItemOption;
