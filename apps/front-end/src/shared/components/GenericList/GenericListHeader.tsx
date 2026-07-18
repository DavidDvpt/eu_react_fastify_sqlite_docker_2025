import { cn } from "@/lib/utils";
import type { GenericListHeaderProps } from "../../types/genericListTypes";

function getHeaderAlignClass(align?: "left" | "center" | "right") {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

function GenericListHeader<T>({
  columns,
  visible,
  className,
  rowHeight = 30,
  columnsTemplate,
}: GenericListHeaderProps<T>) {
  if (!visible || columns.length === 0) return null;

  return (
    <div
      className={cn(
        "top-0 z-10 grid items-center border-b border-table-row-divider bg-table-head-bg text-table-head-text",
        className,
      )}
      style={{
        minHeight: rowHeight,
        gridTemplateColumns: columnsTemplate,
      }}
    >
      {columns.map((column) => (
        <div
          key={column.key}
          className={cn(
            "min-w-0 px-1 font-semibold",
            getHeaderAlignClass(column.align),
            column.headerCellClassName,
          )}
        >
          {column.kind === "image" ? "" : column.label}
        </div>
      ))}
    </div>
  );
}

export { GenericListHeader };
