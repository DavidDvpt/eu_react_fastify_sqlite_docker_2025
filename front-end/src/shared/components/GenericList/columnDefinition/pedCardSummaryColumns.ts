import { FormatTools } from "@/shared/tools";
import type { GenericListColumn } from "@/shared/types";
import type { PedCardSummaryRow } from "@/shared/types/pedcard";

export const pedCardSummaryColumn: GenericListColumn<PedCardSummaryRow>[] = [
  {
    key: "label",
    label: "",
    fillRemainingSpace: true,
    minWidth: 0,
    bodyCellClassName: "font-medium text-table-head-text",
    value: (row: PedCardSummaryRow) => row.label,
  },
  {
    key: "amount",
    label: "",
    kind: "text",
    minWidth: 96,
    maxWidth: 120,
    align: "right",
    bodyCellClassName: "justify-end font-medium text-table-body-text",
    value: (row: PedCardSummaryRow) =>
      FormatTools.pedFormat().format(row.amount),
  },
];

export const pedCardSummaryListClassName =
  "m-2 flex min-h-0 flex-col rounded-md border border-table-border bg-table-bg text-sm shadow-ambient-md";

export const pedCardSummaryBodyClassName = "min-h-0 overflow-auto pr-1";

export const pedCardSummaryRowBaseClassName = "grid items-stretch text-black";

export const pedCardSummaryRowClassName = "border-b-0 last:border-b-0";

export const pedCardSummaryFooterRowClassName =
  "justify-end px-4 py-2 text-table-body-text";

export const pedCardSummaryRowHeight = 30;
