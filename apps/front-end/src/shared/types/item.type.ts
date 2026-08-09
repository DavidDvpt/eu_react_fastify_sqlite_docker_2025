import type { ItemInventory } from "@/pages/inventoryPage/inventory/stockTypes";
import type { ItemDto } from "@eu/types";

export type ItemWithStock = ItemDto & { stock: number };

export interface ItemDetailProps {
  item: ItemInventory | null;
  onBack?: () => void;
  variant?: "transaction" | "stock" | "manage"; // Nouvelle prop pour la variante
}
