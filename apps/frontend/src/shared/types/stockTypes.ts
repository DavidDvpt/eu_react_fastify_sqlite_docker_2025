import type { ItemDto } from "@eu/zod-schemas";

export interface ItemInventory extends ItemDto {
  quantity: number;
  totalValue: number;
}
