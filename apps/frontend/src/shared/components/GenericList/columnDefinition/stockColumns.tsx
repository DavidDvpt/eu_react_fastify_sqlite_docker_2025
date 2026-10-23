import type { GenericListColumn } from '@/shared/types';
import type { StockRow } from '@/shared/helpers/stock';
import { formatItemNameWithTier, getItemStockValue } from '@/shared/helpers';
import { getItemImageUrl } from '@/shared/helpers/imageUrl';
import { FormatTools } from '@/shared/tools/formatTools';
import { RefineActionCell } from '@/shared/components/Refining';

const stockColumns = (
  useCardImageSize?: boolean,
  options?: { onRefine?: (row: StockRow) => void },
): GenericListColumn<StockRow>[] => {
  const onRefine = options?.onRefine;

  const columns: GenericListColumn<StockRow>[] = [
    {
      key: 'image',
      label: 'Image',
      kind: 'image',
      accessor: 'imageUrlId',
      minWidth: 40,
      maxWidth: 40,
      bodyCellClassName: 'bg-transparent',
      imageSize: useCardImageSize ? 'medium' : 'small',
      imageSrc: (value) =>
        typeof value === 'string' && value.trim() !== ''
          ? (getItemImageUrl(value, 'normal') ?? '')
          : '',
      imageAlt: (item) => item.name,
    },
    {
      key: 'name',
      label: 'Item',
      accessor: 'name',
      fillRemainingSpace: true,
      minWidth: 280,
      bodyCellClassName: 'text-text font-semibold pl-1',
      // Display-only tier suffix for tierable non-stackable instances
      // (e.g. "Sword T3"). Never persisted, never sent to the API.
      render: (item) =>
        formatItemNameWithTier({
          name: item.name,
          hasTierOption: item.type?.hasTierOption,
          isStackable: item.type?.isStackable,
          tierLevel: item.tierLevel,
        }),
    },
    {
      key: 'quantity',
      label: 'Quantite',
      minWidth: 120,
      maxWidth: 120,
      align: 'right',
      bodyCellClassName:
        'text-right text-text-muted hover:text-text group-hover:text-text',
      headerCellClassName: 'text-right',
      render: (item) => item.stock,
    },
    {
      key: 'totalPrice',
      label: 'Prix total',
      minWidth: 160,
      maxWidth: 160,
      align: 'right',
      render: (item) =>
        `${FormatTools.pedFormat().format(getItemStockValue(item))} Peds`,
      bodyCellClassName:
        'text-right font-semibold text-text-muted hover:text-text group-hover:text-text',
      headerCellClassName: 'text-right',
    },
  ];

  // Icône « refiner » réservée aux items stackables (un raffinage agrège des
  // ressources) et sans requête par ligne : la modale gère elle-même le cas
  // « aucune recette ».
  if (onRefine) {
    columns.push({
      key: 'refiner',
      label: '',
      kind: 'button',
      minWidth: 44,
      maxWidth: 44,
      align: 'center',
      render: (row) =>
        row.type?.isStackable ? (
          <RefineActionCell item={row} onRefine={onRefine} />
        ) : null,
    });
  }

  return columns;
};

export { stockColumns };
