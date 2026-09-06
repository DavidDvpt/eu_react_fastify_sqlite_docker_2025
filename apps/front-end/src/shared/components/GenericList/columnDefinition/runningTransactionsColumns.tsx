import { getItemImageUrl } from "@/pages/managePage";
import FormatTools from "@/shared/tools/formatTools";
import type {
  GenericColumnOnSelectChangeProps,
  GenericListColumn,
  ItemWithStock,
} from "@/shared/types";
import type { TransactionDto, TransactionStatusPatchDto } from "@eu/types";
import { transactionStatusPatchDtoSchema } from "@eu/zod-schemas";

type RunningTransactionStatusChange = {
  row: TransactionDto;
  accessor?: "status";
  value: TransactionStatusPatchDto;
};

const statusOptions: Array<{
  label: string;
  value: TransactionStatusPatchDto | "RUNNING";
}> = [
  { label: "RUNNING", value: "RUNNING" },
  { label: "SOLDED", value: "SOLDED" },
  { label: "RETURNED", value: "RETURNED" },
  { label: "CANCELED", value: "CANCELED" },
];

const createRunningTransactionsColumns = ({
  isRowPending,
  onChange,
}: {
  isRowPending: (row: TransactionDto) => boolean;
  onChange: (value: RunningTransactionStatusChange) => void;
}): GenericListColumn<TransactionDto>[] => [
  {
    key: "image",
    label: "Image",
    kind: "image",
    accessor: "item",
    minWidth: 40,
    maxWidth: 40,
    headerCellClassName: "px-1",
    bodyCellClassName: "",
    imageSrc: (row) => {
      return (
        getItemImageUrl(
          String((row as ItemWithStock).imageUrlId ?? ""),
          "normal",
        ) ?? ""
      );
    },
    imageAlt: (row) => row.item?.name ?? "Image",
  },
  {
    key: "item",
    label: "Item",
    kind: "text",
    accessor: "item",
    fillRemainingSpace: true,
    minWidth: 140,
    bodyCellClassName: "font-medium text-table-head-text pl-1",
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
    selectOptions: statusOptions,
    disabled: (row) => isRowPending(row),
    onSelectChange: ({
      row,
      accessor,
      value,
    }: GenericColumnOnSelectChangeProps<TransactionDto>) => {
      const result = transactionStatusPatchDtoSchema.safeParse(value);

      if (accessor !== "status" || !result.success) return;

      onChange({
        row,
        accessor,
        value: result.data,
      });
    },
  },
];

export { createRunningTransactionsColumns };
