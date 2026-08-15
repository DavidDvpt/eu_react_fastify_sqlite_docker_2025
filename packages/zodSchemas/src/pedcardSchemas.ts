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

export const pedcardFormSchema = z.object({
  type: pedcardTypeSchema,
  value: z.coerce.number(),
  transactionId: z.string().optional(),
});

export const pedcardPatchSchema = pedcardFormSchema
  .partial()
  .refine((value) => value.type !== undefined || value.value !== undefined, {
    message: "At least one field must be provided",
  });

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
