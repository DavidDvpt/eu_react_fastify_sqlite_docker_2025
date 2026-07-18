import { cn } from "@/lib/utils";
import type { GenericListFooterProps } from "../../types/genericListTypes";

function GenericListFooter({
  visible = true,
  rowClassName,
  layout = "flex",
  columnsTemplate,
  cells,
  fallback,
}: GenericListFooterProps) {
  if (!visible) return null;

  if ((!cells || cells.length === 0) && !fallback) return null;

  if (fallback) {
    return (
      <div className={cn("border-t border-table-border", rowClassName)}>
        {fallback}
      </div>
    );
  }

  if (layout === "grid") {
    return (
      <div className={cn("border-t border-table-border", rowClassName)}>
        <div className="grid" style={{ gridTemplateColumns: columnsTemplate }}>
          {cells?.map((cell) => (
            <div key={cell.key} className={cell.className}>
              {cell.content}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-t border-table-border flex items-center",
        rowClassName,
      )}
    >
      {cells?.map((cell) => (
        <div key={cell.key} className={cell.className}>
          {cell.content}
        </div>
      ))}
    </div>
  );
}

export { GenericListFooter };
