import type { ItemViewModel } from '@zod-schemas';
import type { LotViewModel } from '@zod-schemas';
import type { StockLot } from '@/shared/helpers/stock';

export type ItemWithStock = ItemViewModel & {
  stock: number;
  lots?: StockLot[];
};

export interface ItemDetailProps {
  item: ItemWithStock | null;
  lots?: LotViewModel[] | null;
  /** Single instance this detail refers to (resolved from the lotId query param). */
  lot?: LotViewModel | null;
  onBack?: () => void;
  variant?: 'transaction' | 'stock' | 'manage' | 'store';
}
