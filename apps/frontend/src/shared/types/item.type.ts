import type { ItemViewModel } from "@zod-schemas";
import type { LotViewModel } from "@zod-schemas";

export type ItemWithStock = ItemViewModel & { stock: number };

export interface ItemDetailProps {
  item: ItemWithStock | null;
  lots?: LotViewModel[] | null;
  onBack?: () => void;
  variant?: "transaction" | "stock" | "manage"; // Nouvelle prop pour la variante
}
