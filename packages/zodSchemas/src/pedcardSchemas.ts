import { z } from "zod";

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
});

export const pedcardPatchSchema = pedcardFormSchema
  .omit({ transactionId: true })
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
