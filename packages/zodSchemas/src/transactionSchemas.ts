import { z } from "zod";

export const transactionTypeSchema = z.enum([
  "BUY",
  "SELL",
  "FOUND",
  "GIFT",
  "EXISTING_STOCK",
  "SELL",
  "GIVEN",
]);

export const transactionStatusSchema = z.enum([
  "SOLDED",
  "RUNNING",
  "RETURNED",
]);

export const transactionBodySchema = z.object({
  itemId: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  tt: z.coerce.number().nonnegative(),
  ttc: z.coerce.number().positive(),
  fee: z.coerce.number().nonnegative().optional(),
  type: transactionTypeSchema,
  status: transactionStatusSchema,
});
