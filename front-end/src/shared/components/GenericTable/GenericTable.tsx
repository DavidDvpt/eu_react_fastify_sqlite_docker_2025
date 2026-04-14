import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type GenericTableColumn<T> = {
  key: string;
  header: string;
  accessor?: keyof T;
  render?: (row: T) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

type GenericTableProps<T> = {
  columns: GenericTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  isError?: boolean;
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
  className?: string;
  rowClassName?: string | ((row: T) => string);
};

const DEFAULT_HEADER_CLASS = "px-4 py-3 font-semibold text-foreground";
const DEFAULT_CELL_CLASS = "px-4 py-1.5";
const DEFAULT_ROW_CLASS = "border-b border-border last:border-b-0 hover:bg-muted/30";

function toDisplayValue(value: unknown): ReactNode {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return value as ReactNode;
}

function GenericTable<T>({
  columns,
  rows,
  getRowKey,
  onRowClick,
  isLoading = false,
  isError = false,
  loadingMessage = "Chargement...",
  errorMessage = "Une erreur est survenue.",
  emptyMessage = "Aucune donnee.",
  className,
  rowClassName = DEFAULT_ROW_CLASS,
}: GenericTableProps<T>) {
  const colSpan = columns.length;

  return (
    <table className={cn("w-full border-collapse text-sm", className)}>
      <thead>
        <tr className="border-b border-border bg-muted/40 text-left">
          {columns.map((column) => (
            <th key={column.key} className={cn(DEFAULT_HEADER_CLASS, column.headerClassName)}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td className="px-4 py-4 text-muted-foreground" colSpan={colSpan}>
              {loadingMessage}
            </td>
          </tr>
        ) : isError ? (
          <tr>
            <td className="px-4 py-4 text-danger" colSpan={colSpan}>
              {errorMessage}
            </td>
          </tr>
        ) : rows.length === 0 ? (
          <tr>
            <td className="px-4 py-4 text-muted-foreground" colSpan={colSpan}>
              {emptyMessage}
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr
              key={getRowKey(row)}
              className={typeof rowClassName === "function" ? rowClassName(row) : rowClassName}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column) => {
                const content =
                  column.render?.(row) ??
                  toDisplayValue(
                    column.accessor
                      ? row[column.accessor]
                      : row[column.key as keyof T]
                  );
                return (
                  <td key={column.key} className={cn(DEFAULT_CELL_CLASS, column.cellClassName)}>
                    {content}
                  </td>
                );
              })}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export { GenericTable };
export type { GenericTableColumn, GenericTableProps };
