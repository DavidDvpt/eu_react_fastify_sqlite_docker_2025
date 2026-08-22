import type {
  financialSummarySchema,
  financialValuesSchema,
  financialValuesWithCountSchema,
  itemFinancialSchema,
} from "@eu/zod-schemas";
import { z } from "zod";

export type FinancialValues = z.infer<typeof financialValuesSchema>;
export type FinancialValuesWithCount = z.infer<
  typeof financialValuesWithCountSchema
>;
export type ItemFinancial = z.infer<typeof itemFinancialSchema>;
export type FinancialSummary = z.infer<typeof financialSummarySchema>;
