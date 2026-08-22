import type {
  financialInventoryReportSchema,
  financialItemReportSchema,
  financialReportSchema,
} from "@eu/zod-schemas";
import type z from "zod";

export type FinancialReport = z.infer<typeof financialReportSchema>;
export type FinancialItemReport = z.infer<typeof financialItemReportSchema>;
export type FinancialInventoryReport = z.infer<
  typeof financialInventoryReportSchema
>;
