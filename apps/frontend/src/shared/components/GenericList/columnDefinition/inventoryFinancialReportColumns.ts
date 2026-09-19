import { FormatTools } from "@/shared/tools";
import type { GenericListColumn } from "@/shared/types";

export type InventoryFinancialReportRow = {
  key: string;
  label: string;
  amount: number;
};

export const inventoryFinancialReportColumn: GenericListColumn<InventoryFinancialReportRow>[] =
  [
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

export const inventoryFinancialReportListClassName = "m-2";

export const inventoryFinancialReportBodyClassName =
  "min-h-0 overflow-auto pr-1";

export const inventoryFinancialReportRowBaseClassName =
  "grid items-stretch text-text";

export const inventoryFinancialReportRowClassName =
  "border-b-0 last:border-b-0";

export const inventoryFinancialReportRowHeight = 30;
