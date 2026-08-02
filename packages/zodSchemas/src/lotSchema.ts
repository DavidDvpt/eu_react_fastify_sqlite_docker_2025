import { z } from "zod";
import { booleanHttpSchema } from "./common.js";

export const lotTypeSchema = z.enum(["SESSION_LINE", "TRANSACTION", "LOT"]);

export const lotBodySchema = z.object({
  id: z.string(),
  quantityRemaining: z.coerce.number(),
  quantityExported: z.coerce.number(),
  priceRemaining: z.coerce.number(),
  itemId: z.string(),
  lotType: lotTypeSchema,
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  isActive: booleanHttpSchema,
});
