import type { Item } from "@/shared/types";

export interface ItemInventory extends Item {
  quantity: number;
  totalValue: number;
}
