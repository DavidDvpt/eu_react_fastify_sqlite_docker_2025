import { cn } from "@/lib/utils";
import type { GenericListHeaderProps } from "@/types";
import { resolveAlignClass } from "./utils";

function GenericListHeader<T>({
  columns,
  gridTemplateColumns,
  headerHeight = 44,
  showColumns = true,
}: GenericListHeaderProps<T>) {
  if (!showColumns || columns.length === 0) return null;

  return (
    <div
      className="sticky top-0 z-10 border-b border-table-border bg-table-head-bg"
      style={{ height: `${headerHeight}px`, minHeight: `${headerHeight}px` }}
    >
      <div
        className="grid h-full items-center gap-0"
        style={{ gridTemplateColumns }}
      >
        {columns.map((column) => (
          <div
            key={column.key}
            className={cn(
              "px-4 py-3 font-semibold text-table-head-text",
              resolveAlignClass(column.align),
              column.headerClassName,
            )}
          >
            {column.kind === "image" ? "" : column.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export { GenericListHeader };
