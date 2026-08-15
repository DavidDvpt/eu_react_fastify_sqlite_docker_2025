import type { ItemDto } from "@eu/types";

export interface ItemInventory extends ItemDto {
  quantity: number;
  totalValue: number;
}
