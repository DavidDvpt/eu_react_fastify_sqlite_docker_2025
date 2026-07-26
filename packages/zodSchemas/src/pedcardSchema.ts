import { z } from "zod";

export const pedCardTypeSchema = z.enum([
  "INITIAL_BALANCE",
  "BUY_TTC",
  "BUY_FEE",
  "SELL_TTC",
  "SELL_FEE",
  "ADJUSTMENT",
]);

export const pedcardFormSchema = z.object({
  transactionId: z.string().optional(),
  type: pedCardTypeSchema,
  value: z.number(),
});
