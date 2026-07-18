import { cn } from "@/lib/utils";
import type { GenericListProps } from "../../types/genericListTypes";

import { Section } from "../Containers";
import { GenericListFooter } from "./GenericListFooter";
import GenericListBody from "./GenericListBody";
import { getGridTemplateColumns } from "./gridTemplate";
import { GenericListHeader } from "./GenericListHeader";

function GenericList<T>({
  columns,
  rows,
  getRowKey,
  onRowClick,
  allowCardView = false,
  viewMode,
  hasHeader = false,
  className,
  grow = true,
  headerClassName,
  bodyClassName,
  rowBaseClassName,
  rowClassName,
  cardClassName,
  rowHeight = 40,
  isLoading = false,
  isError = false,
  loadingMessage = "Chargement...",
  errorMessage = "Une erreur est survenue.",
  emptyMessage = "Aucune donnee.",
  footer,
  footerConfig,
  RowComponent,
  CardComponent,
}: GenericListProps<T>) {
  const columnsTemplate = getGridTemplateColumns(columns);

  const view = allowCardView ? (viewMode ?? "list") : "list";

  return (
    <>
      <Section
        className={cn(
          "flex min-h-0 flex-col rounded-md border border-table-border bg-table-bg text-sm",
          grow && "flex-1",
          className,
        )}
      >
        <GenericListHeader
          columns={columns}
          visible={hasHeader && view === "list"}
          className={headerClassName}
          rowHeight={rowHeight}
          columnsTemplate={columnsTemplate}
        />

        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto overflow-x-hidden",
            bodyClassName,
          )}
        >
          {isLoading ? (
            <div className="px-4 py-4 text-table-body-text">
              {loadingMessage}
            </div>
          ) : isError ? (
            <div className="px-4 py-4 text-destructive-500">{errorMessage}</div>
          ) : rows.length === 0 ? (
            <div className="px-4 py-4 text-table-body-text">{emptyMessage}</div>
          ) : (
            <GenericListBody
              columns={columns}
              rows={rows}
              viewMode={view}
              getRowKey={getRowKey}
              onRowClick={onRowClick}
              rowBaseClassName={rowBaseClassName}
              rowClassName={rowClassName}
              cardClassName={cardClassName}
              rowHeight={rowHeight}
              columnsTemplate={columnsTemplate}
              RowComponent={RowComponent}
              CardComponent={CardComponent}
            />
          )}
        </div>

        <GenericListFooter
          visible={
            view === "list" &&
            (Boolean(footer) || Boolean(footerConfig?.cells?.length))
          }
          rowClassName={footerConfig?.rowClassName}
          layout={footerConfig?.layout}
          columnsTemplate={footerConfig?.columnsTemplate ?? columnsTemplate}
          cells={footerConfig?.cells}
          fallback={footer}
        />
      </Section>
    </>
  );
}

export { GenericList };
