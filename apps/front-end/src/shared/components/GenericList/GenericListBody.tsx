import { cn } from "@/lib/utils";
import type { GenericListBodyProps } from "./genericListTypes";
import { GenericCellRenderer } from "./GenericCellRenderer";
import type { GenericListColumn } from "@/shared/types";

const DEFAULT_ROW_CLASS =
  "grid items-stretch border-b border-table-row-divider text-black last:border-b-0 hover:bg-table-row-hover-bg";

const CONTROL_KINDS = new Set(["button", "select", "checkbox"]);

function GenericListBody<T>({
  columns,
  rows,
  viewMode,
  getRowKey,
  onRowClick,
  className,
  rowBaseClassName,
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
            className={cn(rowBaseClassName ?? DEFAULT_ROW_CLASS, rowClassName)}
            style={{ minHeight: rowHeight, height: rowHeight }}
          >
            <div
              className="grid h-full min-w-0"
              style={{ gridTemplateColumns: columnsTemplate }}
            >
              {columns.map((column) => {
                const hasCellClick = Boolean(column.onCellClick);
                const isControlCell = CONTROL_KINDS.has(column.kind ?? "text");
                const handlesCellClick = hasCellClick && !isControlCell;

                return (
                  <div
                    key={column.key}
                    className={cn(
                      "flex min-w-0 overflow-hidden text-black",
                      alignClass(column.align),
                      column.bodyCellClassName,
                      hasCellClick ? "cursor-pointer" : "",
                      !isControlCell && !hasCellClick && onRowClick
                        ? "cursor-pointer"
                        : "",
                    )}
                    role={handlesCellClick ? "button" : undefined}
                    tabIndex={handlesCellClick ? 0 : undefined}
                    onClick={
                      isControlCell
                        ? (event) => event.stopPropagation()
                        : handlesCellClick
                          ? (event) => {
                              event.stopPropagation();
                              column.onCellClick?.(row);
                            }
                          : onRowClick
                            ? () => onRowClick(row)
                            : undefined
                    }
                    onKeyDown={
                      handlesCellClick
                        ? (event) => {
                            if (event.key !== "Enter" && event.key !== " ")
                              return;

                            event.preventDefault();
                            event.stopPropagation();
                            column.onCellClick?.(row);
                          }
                        : undefined
                    }
                  >
                    <GenericCellRenderer column={column} row={row} />
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
