import FormatTools from "@/shared/tools/formatTools";
import type { GenericListColumn } from "@/shared/types";
import type { NexusUpdateDto } from "@eu/types";
import { nexusRequestTypeSchema } from "@eu/zod-schemas";

function createNexusColumns({
  onCellClick,
  onImport,
  isImportPending,
}: {
  onCellClick: (row: NexusUpdateDto) => void;
  onImport: (row: NexusUpdateDto) => void;
  isImportPending: boolean;
}): GenericListColumn<NexusUpdateDto>[] {
  return [
    {
      key: "name",
      label: "Type",
      kind: "custom",
      fillRemainingSpace: true,
      headerCellClassName: "px-3",
      bodyCellClassName: "px-3",
      render: (row) => row.appTypeName,
      onCellClick,
    },
    {
      key: "nexusName",
      label: "NexusSubType",
      kind: "custom",
      fillRemainingSpace: true,
      headerCellClassName: "px-3",
      bodyCellClassName: "px-3",
      render: (row) => row.nexusName ?? row.appTypeName,
      onCellClick,
    },
    {
      key: "requestType",
      label: "Type",
      kind: "custom",
      fillRemainingSpace: true,
      headerCellClassName: "px-3",
      bodyCellClassName: "px-3",
      render: (row) => row.nexusRequestType ?? "",
      onCellClick,
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
    {
      key: "import",
      label: "",
      kind: "button",
      minWidth: 80,
      maxWidth: 80,
      align: "center",
      bodyCellClassName: "justify-center px-2",
      buttonLabel: "Import",
      disabled: (row) =>
        isImportPending ||
        !nexusRequestTypeSchema.safeParse(row.nexusRequestType).success,
      onCellClick: onImport,
    },
  ];
}

export { createNexusColumns };
