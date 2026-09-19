import z from "zod";
import {
  transactionStatusDtoSchema,
  transactionTypeSchema,
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

export type FinancialItemReport = z.infer<typeof financialItemReportSchema>;
export type FinancialInventoryReport = z.infer<
  typeof financialInventoryReportSchema
>;
