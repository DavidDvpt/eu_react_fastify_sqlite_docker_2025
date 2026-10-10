import { FormatTools } from "@/shared/tools";
import type { GenericListColumn } from "@/shared/types";

type FinancialSummaryRow = {
  key: string;
  label: string;
  amount: number;
};

export const financialSummaryColumn: GenericListColumn<FinancialSummaryRow>[] = [
  {
    key: "label",
    label: "",
    fillRemainingSpace: true,
    minWidth: 0,
    bodyCellClassName: "font-medium text-table-head-text",
    value: (row) => row.label,
  },
  {
    key: "amount",
    label: "",
    kind: "text",
    minWidth: 96,
    maxWidth: 120,
    align: "right",
    bodyCellClassName: "justify-end font-medium text-table-body-text",
    value: (row) => FormatTools.pedFormat().format(row.amount),
  },
];

export const financialSummaryBodyClassName = "min-h-0 overflow-auto pr-1";
export const financialSummaryRowBaseClassName = "grid items-stretch text-text";
export const financialSummaryRowClassName = "border-b-0 last:border-b-0";
export const financialSummaryRowHeight = 30;
