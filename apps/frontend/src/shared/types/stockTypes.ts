import type { ItemViewModel } from "@zod-schemas";

export interface ItemInventory extends ItemViewModel {
  quantity: number;
  totalValue: number;
}
