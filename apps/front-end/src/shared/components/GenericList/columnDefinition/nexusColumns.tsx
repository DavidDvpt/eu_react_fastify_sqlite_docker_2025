import FormatTools from "@/shared/tools/formatTools";
import type { GenericListColumn } from "@/shared/types";
import type { NexusUpdateDto } from "@eu/types";

import { NexusEditLink } from "./NexusEditLink";

const nexusColumns: GenericListColumn<NexusUpdateDto>[] = [
  {
    key: "name",
    label: "Type",
    kind: "custom",
    fillRemainingSpace: true,
    headerCellClassName: "px-3",
    bodyCellClassName: "px-3",
    render: (row) => <NexusEditLink row={row} value={row.appTypeName} />,
  },
  {
    key: "nexusName",
    label: "NexusSubType",
    kind: "custom",
    fillRemainingSpace: true,
    headerCellClassName: "px-3",
    bodyCellClassName: "px-3",
    render: (row) => (
      <NexusEditLink row={row} value={row.nexusName ?? row.appTypeName} />
    ),
  },
  {
    key: "requestType",
    label: "Type",
    kind: "custom",
    fillRemainingSpace: true,
    headerCellClassName: "px-3",
    bodyCellClassName: "px-3",
    render: (row) => (
      <NexusEditLink row={row} value={row.nexusRequestType ?? ""} />
    ),
  },
  {
    key: "itemCount",
    label: "Items",
    accessor: "itemCount",
    kind: "number",
    minWidth: 100,
    maxWidth: 100,
    align: "right",
    headerCellClassName: "px-3",
    bodyCellClassName: "px-3 justify-end font-medium text-table-body-text",
  },
  {
    key: "imageMissingCount",
    label: "Images KO",
    accessor: "imageMissingCount",
    kind: "number",
    minWidth: 100,
    maxWidth: 100,
    align: "right",
    headerCellClassName: "px-3",
    bodyCellClassName: "px-3 justify-end font-medium text-table-body-text",
  },
  {
    key: "changeCount",
    label: "Changes",
    accessor: "changeCount",
    kind: "number",
    minWidth: 100,
    maxWidth: 100,
    align: "right",
    headerCellClassName: "px-3",
    bodyCellClassName: "px-3 justify-end font-medium text-table-body-text",
  },
  {
    key: "createdAt",
    label: "Created",
    accessor: "createdAt",
    kind: "date",
    minWidth: 100,
    maxWidth: 100,
    align: "right",
    headerCellClassName: "px-3",
    bodyCellClassName: "px-3 justify-end font-medium text-table-body-text",
    value: (row) => FormatTools.dateFrShort(row.createdAt),
  },
  {
    key: "insertedAt",
    label: "Inserted",
    accessor: "insertedAt",
    kind: "date",
    minWidth: 100,
    maxWidth: 100,
    align: "right",
    headerCellClassName: "px-3",
    bodyCellClassName: "px-3 justify-end font-medium text-table-body-text",
    value: (row) => FormatTools.dateFrShort(row.insertedAt ?? row.createdAt),
  },
  {
    key: "updatedAt",
    label: "Updated",
    accessor: "updatedAt",
    kind: "date",
    minWidth: 100,
    maxWidth: 100,
    align: "right",
    headerCellClassName: "px-3",
    bodyCellClassName: "px-3 justify-end font-medium text-table-body-text",
    value: (row) => FormatTools.dateFrShort(row.updatedAt ?? row.createdAt),
  },
];

export { nexusColumns };
