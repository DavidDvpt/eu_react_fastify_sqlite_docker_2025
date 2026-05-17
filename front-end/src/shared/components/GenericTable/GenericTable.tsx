import { cn } from "@/lib/utils";
import type { GenericTableProps } from "@/shared/types";
import {
  DEFAULT_CELL_CLASS,
  DEFAULT_FOOTER_CLASS,
  DEFAULT_HEADER_CLASS,
  DEFAULT_ROW_CLASS,
  IMAGE_COLUMN_SIZE_CLASS,
  isImageColumn,
  toDisplayValue,
} from "./utils";

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
    <section
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
                    column.headerCellClassName,
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
                          column.bodyCellClassName,
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
    </section>
  );
}

export { GenericTable };
