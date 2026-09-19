import { z } from "zod";
import { booleanSchema } from "./common.js";

export const pedcardTypeSchema = z.enum([
  "INITIAL_BALANCE",
  "BUY_TTC",
  "BUY_FEE",
  "SELL_TTC",
  "SELL_FEE",
  "ADJUSTMENT",
]);

export const pedcardDtoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  transactionId: z.string().nullable(),
  type: pedcardTypeSchema,
  value: z.coerce.number(),
  createdat: z.string(),
});

export const pedcardCheckSchema = z.object({ initialized: booleanSchema });
export const pedcardCanPaySchema = z.object({ authorized: booleanSchema });
export const pedcardBalanceSchema = z.object({ balance: z.number() });

export type PedcardTypeDto = z.output<typeof pedcardTypeSchema>;
export type PedcardDto = z.infer<typeof pedcardDtoSchema>;
export type PedcardCheck = z.infer<typeof pedcardCheckSchema>;
export type PedcardCanPay = z.infer<typeof pedcardCanPaySchema>;
export type PedcardBalance = z.infer<typeof pedcardBalanceSchema>;
