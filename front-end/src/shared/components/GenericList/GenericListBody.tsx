import { cn } from "@/lib/utils";
import type {
  GenericListBodyProps,
  GenericListColumn,
} from "../../types/genericListTypes";
import { GenericCellRenderer } from "./GenericCellRenderer";

const DEFAULT_ROW_CLASS =
  "text-black odd:bg-table-row-odd-bg border odd:border--table-row-odd-bgeven:bg-table-row-even-bg even:border-table-row-even-bg hover:bg-table-row-hover-bg";

const ACTION_KINDS = new Set(["button", "select", "checkbox", "custom"]);

function GenericListBody<T>({
  columns,
  rows,
  viewMode,
  getRowKey,
  onRowClick,
  className,
  rowClassName,
  cardClassName,
  rowHeight = 30,
  RowComponent,
  CardComponent,
}: GenericListBodyProps<T>) {
  const alignClass = (align: GenericListColumn<T>["align"]) => {
    if (align === "center") return "text-center";
    if (align === "right") return "text-right";
    return "text-left";
  };

  if (viewMode === "card") {
    return (
      <div
        className={cn(
          "grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 p-3",
          cardClassName,
        )}
      >
        {rows.map((row) => {
          if (CardComponent) {
            return (
              <CardComponent
                key={getRowKey(row)}
                row={row}
                onRowClick={onRowClick}
              />
            );
          }

          return (
            <div
              key={getRowKey(row)}
              className={cn(
                "rounded-md border border-table-border p-3",
                onRowClick ? "cursor-pointer" : "",
              )}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column) => (
                <div
                  key={column.key}
                  className={cn("py-1", column.bodyCellClassName)}
                >
                  <GenericCellRenderer column={column} row={row} />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {rows.map((row) => {
        if (RowComponent) {
          return (
            <RowComponent
              key={getRowKey(row)}
              row={row}
              onRowClick={onRowClick}
            />
          );
        }

        return (
          <div
            key={getRowKey(row)}
            className={cn(DEFAULT_ROW_CLASS, rowClassName)}
            style={{ minHeight: rowHeight, height: rowHeight }}
          >
            <div className="flex items-stretch">
              {columns.map((column) => {
                const isActionCell =
                  ACTION_KINDS.has(column.kind ?? "text") ||
                  Boolean(column.onCellClick);
                return (
                  <div
                    key={column.key}
                    className={cn(
                      "flex items-center pl-1 text-black",
                      alignClass(column.align),
                      column.bodyCellClassName,
                      !isActionCell && onRowClick ? "cursor-pointer" : "",
                    )}
                    style={{ width: column.width }}
                    onClick={
                      isActionCell
                        ? (event) => {
                            event.stopPropagation();
                            column.onCellClick?.(row);
                          }
                        : onRowClick
                          ? () => onRowClick(row)
                          : undefined
                    }
                  >
                    {column.kind === "image" ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <GenericCellRenderer column={column} row={row} />
                      </div>
                    ) : (
                      <GenericCellRenderer column={column} row={row} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default GenericListBody;
