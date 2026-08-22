import { z } from "zod";
import { transactionStatusDtoSchema } from "./transactionSchemas.js";
import { transactionTypeSchema } from "./transactionTypeSchema.js";

export const financialValuesSchema = z.object({
  tt: z.coerce.number(),
  fee: z.coerce.number().nonnegative(),
  ttc: z.coerce.number(),
});
export const financialValuesWithCountSchema = financialValuesSchema.extend({
  count: z.coerce.number().int().nonnegative(),
});

export const inFinancialTypeSchema = transactionTypeSchema
  .exclude(["SELL"])
  .or(z.literal("TOTAL"));

export const itemFinancialSchema = z.object({
  in: z.record(inFinancialTypeSchema, financialValuesWithCountSchema),
  out: z.object({
    RUNNING: financialValuesWithCountSchema,
    RETURNED: financialValuesWithCountSchema,
    CANCELED: financialValuesWithCountSchema,
    SOLDED: financialValuesWithCountSchema,
  }),
});

export const financialSummarySchema = z.record(
  z.string(),
  itemFinancialSchema.array(),
);
