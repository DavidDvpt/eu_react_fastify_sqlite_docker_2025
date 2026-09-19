import type { ItemDto } from "@zod-schemas";

export interface ItemInventory extends ItemDto {
  quantity: number;
  totalValue: number;
}
