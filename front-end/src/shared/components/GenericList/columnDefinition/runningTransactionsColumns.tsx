import type { ReactNode } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageService } from "@/shared/services";
import FormatTools from "@/shared/tools/formatTools";
import type {
  CreateRunningTransactionsColumnsOptions,
  GenericListColumn,
  RunningTransaction,
} from "@/shared/types";

function renderImage(row: RunningTransaction): ReactNode {
  const imageUrl = row.item?.imageUrlId
    ? ImageService.getItemImageUrl(row.item.imageUrlId, "micro")
    : null;

  if (!imageUrl) {
    return (
      <div className="grid h-8 w-8 place-items-center rounded-lg border border-dashed border-table-border bg-muted text-xs font-semibold text-muted-foreground">
        -
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={row.item?.name ?? row.itemName}
      className="h-8 w-8 rounded-lg border border-table-border bg-muted object-contain"
      loading="lazy"
    />
  );
}

function renderStatus(
  row: RunningTransaction,
  isRowPending: (row: RunningTransaction) => boolean,
  onStatusChange: (
    row: RunningTransaction,
    status: "SOLDED" | "RETURNED",
  ) => void,
) {
  return (
    <div className="flex justify-end">
      <Select
        value={row.saleStatus}
        onValueChange={(value) => {
          if (value === "RUNNING") {
            return;
          }

          onStatusChange(row, value as "SOLDED" | "RETURNED");
        }}
        disabled={isRowPending(row)}
      >
        <SelectTrigger className="h-8 w-full rounded-lg border-info/25 bg-info/5 px-2 text-[0.7rem] font-semibold uppercase tracking-[0.04em]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="RUNNING">RUNNING</SelectItem>
          <SelectItem value="SOLDED">SOLDED</SelectItem>
          <SelectItem value="RETURNED">RETURNED</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

const createRunningTransactionsColumns = ({
  isRowPending,
  onStatusChange,
}: CreateRunningTransactionsColumnsOptions): GenericListColumn<RunningTransaction>[] => [
  {
    key: "image",
    label: "Image",
    kind: "custom",
    minWidth: 40,
    maxWidth: 40,
    headerCellClassName: "px-1",
    bodyCellClassName: "px-1",
    render: renderImage,
  },
  {
    key: "item",
    label: "Item",
    kind: "text",
    accessor: "itemName",
    fillRemainingSpace: true,
    minWidth: 140,
    bodyCellClassName: "font-medium text-table-head-text",
    render: (row) => row.item?.name ?? row.itemName,
  },
  {
    key: "quantity",
    label: "Qte",
    kind: "number",
    accessor: "quantity",
    minWidth: 56,
    maxWidth: 56,
    align: "right",
    bodyCellClassName: "justify-end font-medium text-table-body-text",
    render: (row) => row.quantity,
  },
  {
    key: "tt",
    label: "TT",
    kind: "number",
    accessor: "tt",
    minWidth: 72,
    maxWidth: 72,
    align: "right",
    bodyCellClassName: "justify-end font-medium text-table-body-text",
    render: (row) => FormatTools.pedFormat().format(row.tt),
  },
  {
    key: "ttc",
    label: "TTC",
    kind: "number",
    accessor: "ttc",
    minWidth: 72,
    maxWidth: 72,
    align: "right",
    bodyCellClassName: "justify-end font-medium text-table-body-text",
    render: (row) => FormatTools.pedFormat().format(row.ttc),
  },
  {
    key: "status",
    label: "Statut",
    kind: "select",
    minWidth: 110,
    maxWidth: 110,
    align: "right",
    bodyCellClassName: "justify-end",
    render: (row) => renderStatus(row, isRowPending, onStatusChange),
  },
];

export { createRunningTransactionsColumns };
