import { cn } from "@/lib/utils";
import type { GenericListProps } from "@/shared/types";
import { GenericListBody } from "./GenericListBody";
import { GenericListFooter } from "./GenericListFooter";
import { GenericListHeader } from "./GenericListHeader";
import { buildGridTemplateColumns, resolveViewMode } from "./utils";

function GenericList<T>({
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
  bodyClassName,
  rowClassName,
  viewMode = "list",
  allowCardView = false,
  showColumns = true,
  headerHeight = 44,
  footerHeight = 44,
  rowHeight = 40,
  footer,
  renderRow,
  renderCard,
}: GenericListProps<T>) {
  const resolvedViewMode = resolveViewMode(viewMode, allowCardView);
  const gridTemplateColumns = buildGridTemplateColumns(columns);

  return (
    <section
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-table-border shadow-table bg-table-bg text-sm",
        className,
      )}
    >
      <GenericListHeader
        columns={columns}
        gridTemplateColumns={gridTemplateColumns}
        headerHeight={headerHeight}
        showColumns={resolvedViewMode === "list" && showColumns}
      />

      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overflow-x-hidden",
          bodyClassName,
        )}
      >
        {isLoading ? (
          <div className="px-4 py-4 text-table-body-text">{loadingMessage}</div>
        ) : isError ? (
          <div className="px-4 py-4 text-destructive-500">{errorMessage}</div>
        ) : rows.length === 0 ? (
          <div className="px-4 py-4 text-table-body-text">{emptyMessage}</div>
        ) : (
          <GenericListBody
            columns={columns}
            rows={rows}
            viewMode={resolvedViewMode}
            gridTemplateColumns={gridTemplateColumns}
            getRowKey={getRowKey}
            onRowClick={onRowClick}
            rowClassName={rowClassName}
            rowHeight={rowHeight}
            showColumns={showColumns}
            renderRow={renderRow}
            renderCard={renderCard}
          />
        )}
      </div>

      <GenericListFooter
        footer={footer}
        gridTemplateColumns={gridTemplateColumns}
        footerHeight={footerHeight}
        showColumns={resolvedViewMode === "list" && showColumns}
      />
    </section>
  );
}

export { GenericList };
