import { z } from "zod";

export const transactionBodySchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().positive(),
  tt: z.number().nonnegative(),
  ttc: z.number().positive(),
  fee: z.number().nonnegative().optional(),
  type: z.enum(["BUY", "SELL"]),
});
