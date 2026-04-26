import { cn } from "@/lib/utils";
import type { GenericListFooterProps } from "@/shared/types";

function GenericListFooter({
  footer,
  gridTemplateColumns,
  footerHeight = 44,
  showColumns = true,
}: GenericListFooterProps) {
  if (!footer) return null;

  return (
    <div
      className="border-t border-table-border bg-table-foot-bg"
      style={{ height: `${footerHeight}px`, minHeight: `${footerHeight}px` }}
    >
      {showColumns ? (
        <div
          className="grid h-full items-center"
          style={{ gridTemplateColumns }}
        >
          <div
            className={cn(
              "col-[1/-1] px-4 py-3 text-right text-sm font-semibold text-table-foot-text",
            )}
          >
            {footer}
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center px-4 py-3 text-right text-sm font-semibold text-table-foot-text">
          <div className="ml-auto">{footer}</div>
        </div>
      )}
    </div>
  );
}

export { GenericListFooter };
