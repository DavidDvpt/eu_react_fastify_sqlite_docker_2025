import { cn } from "@/lib/utils";
import type { GenericListHeaderProps } from "../../types/genericListTypes";

function GenericListHeader<T>({
  columns,
  visible = true,
  className,
  rowHeight = 30,
}: GenericListHeaderProps<T>) {
  if (!visible || columns.length === 0) return null;

  return (
    <div
      className={cn("flex flex-row justify-center top-0 z-10 ", className)}
      style={{ minHeight: rowHeight }}
    >
      {columns.map((column) => (
        <div
          key={column.key}
          className={cn(
            "pl-1 font-semibold text-black",
            column.headerCellClassName,
          )}
          style={{ width: column.width }}
        >
          {column.kind === "image" ? "" : column.label}
        </div>
      ))}
    </div>
  );
}

export { GenericListHeader };
