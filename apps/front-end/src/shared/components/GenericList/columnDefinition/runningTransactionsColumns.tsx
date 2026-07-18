import { ImageService } from "@/shared/services";
import FormatTools from "@/shared/tools/formatTools";
import type {
  CreateRunningTransactionsColumnsOptions,
  GenericListColumn,
  RunningTransaction,
} from "@/shared/types";
import type { TransactionStatusDto } from "@eu/types";

const createRunningTransactionsColumns = ({
  isRowPending,
  onStatusChange,
}: CreateRunningTransactionsColumnsOptions): GenericListColumn<RunningTransaction>[] => [
  {
    key: "image",
    label: "Image",
    kind: "image",
    accessor: "item",
    minWidth: 40,
    maxWidth: 40,
    headerCellClassName: "px-1",
    bodyCellClassName: "px-1",
    imageSrc: (_, row) =>
      row.item?.imageUrlId
        ? (ImageService.getItemImageUrl(row.item.imageUrlId, "micro") ?? "")
        : "",
    imageAlt: (row) => row.item?.name ?? row.item!.name,
  },
  {
    key: "item",
    label: "Item",
    kind: "text",
    accessor: "item",
    fillRemainingSpace: true,
    minWidth: 140,
    bodyCellClassName: "font-medium text-table-head-text",
    value: (row) => row.item?.name ?? row.item!.name,
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
  },
  {
    key: "tt",
    label: "TT",
    kind: "text",
    accessor: "tt",
    minWidth: 72,
    maxWidth: 72,
    align: "right",
    bodyCellClassName: "justify-end font-medium text-table-body-text",
    value: (row) => FormatTools.pedFormat().format(row.tt),
  },
  {
    key: "ttc",
    label: "TTC",
    kind: "text",
    accessor: "ttc",
    minWidth: 72,
    maxWidth: 72,
    align: "right",
    bodyCellClassName: "justify-end font-medium text-table-body-text",
    value: (row) => FormatTools.pedFormat().format(row.ttc),
  },
  {
    key: "status",
    label: "Statut",
    kind: "select",
    accessor: "status",
    minWidth: 110,
    maxWidth: 110,
    align: "right",
    bodyCellClassName: "justify-end",
    selectOptions: [
      { label: "RUNNING", value: "RUNNING" },
      { label: "SOLDED", value: "SOLDED" },
      { label: "RETURNED", value: "RETURNED" },
    ],
    disabled: (row) => isRowPending(row),
    onSelectChange: (row, value) => {
      if (value === "RUNNING") {
        return;
      }

      onStatusChange(row, value as TransactionStatusDto);
    },
  },
];

export { createRunningTransactionsColumns };
