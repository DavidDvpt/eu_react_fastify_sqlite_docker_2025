import z from "zod";
import { transactionTypeSchema } from "./transactionTypeSchema.js";
import {
  transactionStatusDtoSchema,
  transactionValuesSchema,
} from "./transactionSchemas.js";

export const financialItemInTypeSchema = transactionTypeSchema.exclude([
  "SELL",
]);

export const financialInventoryReportSchema = z.object({
  totalIn: transactionValuesSchema,
  totalOut: transactionValuesSchema,
  inCount: z.record(financialItemInTypeSchema, z.number().int()),
  outCount: z.record(transactionStatusDtoSchema, z.number().int()),
});
export const financialItemReportSchema = financialInventoryReportSchema.extend({
  in: z.record(financialItemInTypeSchema, transactionValuesSchema),
  out: z.record(transactionStatusDtoSchema, transactionValuesSchema),
});

export const financialReportSchema = z.record(
  z.string(),
  financialItemReportSchema,
);
