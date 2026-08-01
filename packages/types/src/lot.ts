import type { lotBodySchema, lotTypeSchema } from "@eu/zod-schemas";
import { z } from "zod";

export type LotTypeDto = z.output<typeof lotTypeSchema>;

export type lotFormIntputBody = z.input<typeof lotBodySchema>;
export type LotFormOutputBody = z.output<typeof lotBodySchema>;

export type LotSortField = "date_created" | "date_updated";

export type LotDto = {
  id: string;
  quantityRemaining: number;
  quantityExported: number;
  priceRemaining: number;
  itemId: string;
  lotType: LotTypeDto;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
};
