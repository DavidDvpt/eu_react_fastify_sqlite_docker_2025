import { z } from "zod";
import { booleanSchema, genericDateSchema } from "./common.js";

export const lotTypeSchema = z.enum([
  "MINING",
  "CRAFTING",
  "TRADE",
  "REFINING",
]);
export const lotItemIdSchema = z.object({ itemId: z.string() });

export const lotViewModelSchema = lotItemIdSchema.extend({
  id: z.string(),
  initialQuantity: z.coerce.number(),
  quantityRemaining: z.coerce.number(),
  quantityExported: z.coerce.number(),
  priceRemaining: z.coerce.number(),

  lotType: lotTypeSchema,
  isActive: booleanSchema,
  ...genericDateSchema.shape,
});

export type LotViewModel = z.infer<typeof lotViewModelSchema>;
