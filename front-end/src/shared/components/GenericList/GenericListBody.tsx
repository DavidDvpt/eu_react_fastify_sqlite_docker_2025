import { cn } from "@/lib/utils";
import type { GenericListBodyProps } from "@/types";
import {
  resolveAlignClass,
  resolveCellContent,
  resolveRowClassName,
} from "./utils";

const DEFAULT_ROW_CLASS =
  "border-b border-table-border text-table-head-text last:border-b-0 odd:bg-table-row-odd-bg even:bg-table-row-even-bg hover:bg-table-row-hover-bg";

function GenericListBody<T>({
  columns,
  rows,
  viewMode,
  gridTemplateColumns,
  getRowKey,
  onRowClick,
  rowClassName,
  rowHeight = 40,
  showColumns = true,
  renderRow,
  renderCard,
}: GenericListBodyProps<T>) {
  if (viewMode === "card") {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 p-3">
        {rows.map((row) => (
          <div
            key={getRowKey(row)}
            className={cn(
              "rounded-md border border-table-border bg-card p-3 shadow-sm",
              onRowClick ? "cursor-pointer" : "",
              resolveRowClassName(row, rowClassName),
            )}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            {renderCard ? renderCard(row) : null}
          </div>
        ))}
      </div>
    );
  }

  if (!showColumns) {
    return (
      <div className="flex flex-col">
        {rows.map((row) => (
          <div
            key={getRowKey(row)}
            className={cn(
              DEFAULT_ROW_CLASS,
              onRowClick ? "cursor-pointer" : "",
              "px-4 py-2",
              resolveRowClassName(row, rowClassName),
            )}
            style={{ minHeight: `${rowHeight}px` }}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
          >
            {renderRow ? renderRow(row) : null}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {rows.map((row) => (
        <div
          key={getRowKey(row)}
          className={cn(
            DEFAULT_ROW_CLASS,
            onRowClick ? "cursor-pointer" : "",
            resolveRowClassName(row, rowClassName),
          )}
          onClick={onRowClick ? () => onRowClick(row) : undefined}
        >
          <div
            className="grid items-center"
            style={{
              gridTemplateColumns,
              minHeight: `${rowHeight}px`,
            }}
          >
            {columns.map((column) => (
              <div
                key={column.key}
                className={cn(
                  "px-4 py-1.5 text-table-body-text",
                  resolveAlignClass(column.align),
                  column.cellClassName,
                )}
              >
                {column.kind === "image" ? (
                  <div className="flex h-full w-full items-center justify-center">
                    {resolveCellContent(column, row)}
                  </div>
                ) : (
                  resolveCellContent(column, row)
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export { GenericListBody };
