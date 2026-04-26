import type {
  GenericListAlign,
  GenericListColumn,
  GenericListRowClassName,
  GenericListViewMode,
} from "@/shared/types";
import type { ReactNode } from "react";

function buildGridTemplateColumns<T>(columns: GenericListColumn<T>[]): string {
  if (columns.length === 0) return "minmax(0, 1fr)";
  return columns
    .map((column) => column.width?.trim() || "minmax(0, 1fr)")
    .join(" ");
}

function resolveViewMode(
  requestedMode: GenericListViewMode,
  allowCardView: boolean,
): GenericListViewMode {
  if (requestedMode === "card" && !allowCardView) return "list";
  return requestedMode;
}

function toDisplayValue(value: unknown): ReactNode {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return value as ReactNode;
}

function resolveCellContent<T>(
  column: GenericListColumn<T>,
  row: T,
): ReactNode {
  if (column.render) return column.render(row);
  if (column.accessor) return toDisplayValue(row[column.accessor]);
  return toDisplayValue(row[column.key as keyof T]);
}

function resolveAlignClass(align: GenericListAlign | undefined): string {
  switch (align) {
    case "right":
      return "text-right";
    case "center":
      return "text-center";
    case "left":
    default:
      return "text-left";
  }
}

function resolveRowClassName<T>(
  row: T,
  rowClassName: GenericListRowClassName<T> | undefined,
): string {
  if (!rowClassName) return "";
  return typeof rowClassName === "function" ? rowClassName(row) : rowClassName;
}

export {
  buildGridTemplateColumns,
  resolveCellContent,
  resolveRowClassName,
  resolveViewMode,
  resolveAlignClass,
};
