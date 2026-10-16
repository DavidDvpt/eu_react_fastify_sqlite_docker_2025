import type { ItemViewModel } from "@zod-schemas";

export type EnhancerLine = {
  itemId: string;
  socket: string;
  quantityRemaining: number;
  costLineId?: string;
};

export type CockpitItemProps = {
  item?: ItemViewModel;
  itemId?: string | null;
  tierLevel?: number | null;
};
