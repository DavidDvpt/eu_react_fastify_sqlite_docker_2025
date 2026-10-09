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
  ttRemaining: z.coerce.number(),
  tierLevel: z.coerce.number().int().min(0).max(10).nullable().optional(),

  lotType: z.string(),
  isActive: booleanSchema,
  ...genericDateSchema.shape,
});

export type LotViewModel = z.infer<typeof lotViewModelSchema>;
