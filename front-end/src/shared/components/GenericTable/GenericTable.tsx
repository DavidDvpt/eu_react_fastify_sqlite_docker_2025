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
  footer?: ReactNode;
};

const DEFAULT_HEADER_CLASS =
  "px-4 py-3 font-semibold text-table-head-text bg-table-head-bg";
const DEFAULT_CELL_CLASS = "px-4 py-1.5 h-10 text-table-body-text";
const IMAGE_COLUMN_SIZE_CLASS = "w-[32px] min-w-[32px] max-w-[32px] px-0";
const DEFAULT_ROW_CLASS =
  "border-b border-table-border text-table-head-text last:border-b-0 odd:bg-table-row-odd-bg even:bg-table-row-even-bg hover:bg-table-row-hover-bg cursor-pointer";
const DEFAULT_FOOTER_CLASS =
  "sticky bottom-0 z-20 bg-table-foot-bg px-4 py-3 text-right text-sm font-semibold text-table-foot-text";
function toDisplayValue(value: unknown): ReactNode {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return value as ReactNode;
}

function isImageColumn<T>(column: GenericTableColumn<T>): boolean {
  const key = column.key.toLowerCase();
  const accessor =
    typeof column.accessor === "string" ? column.accessor.toLowerCase() : "";

  return key.includes("image") || accessor.includes("image");
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
  footer,
}: GenericTableProps<T>) {
  const colSpan = columns.length;

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-table-border shadow-table",
        className,
      )}
    >
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <table className="w-full border-separate border-spacing-0 bg-table-bg text-sm">
          <thead>
            <tr className="text-left">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    DEFAULT_HEADER_CLASS,
                    "sticky top-0 z-10",
                    isImageColumn(column) && IMAGE_COLUMN_SIZE_CLASS,
                    column.headerClassName,
                  )}
                >
                  {isImageColumn(column) ? "" : column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  className="px-4 py-4 text-table-body-text"
                  colSpan={colSpan}
                >
                  {loadingMessage}
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td
                  className="px-4 py-4 text-destructive-500"
                  colSpan={colSpan}
                >
                  {errorMessage}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-4 text-table-body-text"
                  colSpan={colSpan}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={getRowKey(row)}
                  className={cn(
                    DEFAULT_ROW_CLASS,
                    typeof rowClassName === "function"
                      ? rowClassName(row)
                      : rowClassName,
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((column) => {
                    const imageColumn = isImageColumn(column);
                    const content =
                      column.render?.(row) ??
                      toDisplayValue(
                        column.accessor
                          ? row[column.accessor]
                          : row[column.key as keyof T],
                      );
                    return (
                      <td
                        key={column.key}
                        className={cn(
                          DEFAULT_CELL_CLASS,
                          imageColumn && IMAGE_COLUMN_SIZE_CLASS,
                          column.cellClassName,
                        )}
                      >
                        {imageColumn ? (
                          <div className="flex h-full w-full items-center justify-center">
                            {content}
                          </div>
                        ) : (
                          content
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
          {footer ? (
            <tfoot>
              <tr>
                <td colSpan={colSpan} className={DEFAULT_FOOTER_CLASS}>
                  {footer}
                </td>
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>
    </div>
  );
}

export { GenericTable };
export type { GenericTableColumn, GenericTableProps };
