import FormatTools from "@/shared/tools/formatTools";
import type { GenericListColumn } from "@/shared/types";
import type { NexusUpdateDto } from "@eu/types";

const nexusColumns: GenericListColumn<NexusUpdateDto>[] = [
  {
    key: "name",
    label: "Type",
    accessor: "name",
    kind: "text",
    fillRemainingSpace: true,
    // minWidth: 180,
    bodyCellClassName: "px-3 font-medium text-table-head-text",
  },
  {
    key: "itemCount",
    label: "Items",
    accessor: "itemCount",
    kind: "number",
    minWidth: 120,
    maxWidth: 120,
    align: "right",
    bodyCellClassName: "px-3 justify-end font-medium text-table-body-text",
  },
  {
    key: "imageMissingCount",
    label: "Images KO",
    accessor: "imageMissingCount",
    kind: "number",
    minWidth: 120,
    maxWidth: 120,
    align: "right",
    bodyCellClassName: "px-3 justify-end font-medium text-table-body-text",
  },
  {
    key: "changeCount",
    label: "Changes",
    accessor: "changeCount",
    kind: "number",
    minWidth: 120,
    maxWidth: 120,
    align: "right",
    bodyCellClassName: "px-3 justify-end font-medium text-table-body-text",
  },
  {
    key: "detailMissing",
    label: "Detail KO",
    kind: "text",
    minWidth: 120,
    maxWidth: 120,
    align: "right",
    bodyCellClassName: "px-3 justify-center font-medium text-table-body-text",
    value: (row) => (row.detailMissing ? "Oui" : "Non"),
  },
  {
    key: "updatedAt",
    label: "Maj",
    accessor: "updatedAt",
    kind: "date",
    minWidth: 120,
    maxWidth: 120,
    align: "right",
    bodyCellClassName: "px-3 justify-end font-medium text-table-body-text",
    value: (row) =>
      FormatTools.dateFrShort(row.updatedAt ?? row.insertedAt ?? row.createdAt),
  },
];

export { nexusColumns };
