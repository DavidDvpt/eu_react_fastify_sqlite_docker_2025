import { z } from "zod";

export const transactionBodySchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().positive(),
  inventoryLotId: z.string().min(1).optional(),
  tt: z.number().nonnegative(),
  ttc: z.number().nonnegative(),
  fee: z.number().nonnegative().optional(),
  type: z.enum(["buy", "sell"]),
});
