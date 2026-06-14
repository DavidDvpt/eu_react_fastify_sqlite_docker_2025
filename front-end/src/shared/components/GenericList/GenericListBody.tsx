import { cn } from "@/lib/utils";
import type {
  GenericListBodyProps,
  GenericListColumn,
} from "../../types/genericListTypes";
import { GenericCellRenderer } from "./GenericCellRenderer";

const DEFAULT_ROW_CLASS =
  "grid items-stretch border-b border-table-row-divider text-black last:border-b-0 hover:bg-table-row-hover-bg";

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
  columnsTemplate,
  RowComponent,
  CardComponent,
}: GenericListBodyProps<T>) {
  const alignClass = (align: GenericListColumn<T>["align"]) => {
    if (align === "center") return "items-center justify-center text-center";
    if (align === "right") return "items-center justify-end text-right";
    return "items-center justify-start text-left";
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
            <div
              className="grid h-full min-w-0"
              style={{ gridTemplateColumns: columnsTemplate }}
            >
              {columns.map((column) => {
                const isActionCell =
                  ACTION_KINDS.has(column.kind ?? "text") ||
                  Boolean(column.onCellClick);

                return (
                  <div
                    key={column.key}
                    className={cn(
                      "flex min-w-0 overflow-hidden px-1 text-black",
                      alignClass(column.align),
                      column.bodyCellClassName,
                      !isActionCell && onRowClick ? "cursor-pointer" : "",
                    )}
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
