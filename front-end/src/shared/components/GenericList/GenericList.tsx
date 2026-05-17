import { cn } from "@/lib/utils";
import { useState } from "react";
import type {
  GenericListProps,
  GenericListViewMode,
} from "../../types/genericListTypes";
import { GenericListHeader } from "./GenericListHeader";
import { Section } from "../Containers";
import { GenericListFooter } from "./GenericListFooter";
import SwitchApp from "../form/Switch/SwitchApp";
import GenericListBody from "./GenericListBody";

function GenericList<T>({
  columns,
  rows,
  getRowKey,
  onRowClick,
  allowCardView = false,
  className,
  headerClassName,
  bodyClassName,
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
  const [viewMode, setViewMode] = useState<GenericListViewMode>("list");

  return (
    <>
      <SwitchApp
        value={viewMode === "card"}
        onChange={(checked) => setViewMode(checked ? "card" : "list")}
        trueValue="Vue carte"
        falseValue="Vue liste"
        visible={allowCardView}
      />

      <Section
        className={cn(
          "overflow-hidden rounded-md border border-table-border bg-table-bg text-sm",
          className,
        )}
      >
        <GenericListHeader
          columns={columns}
          visible={viewMode === "list"}
          className={headerClassName}
          rowHeight={rowHeight}
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
              viewMode={viewMode}
              getRowKey={getRowKey}
              onRowClick={onRowClick}
              rowClassName={rowClassName}
              cardClassName={cardClassName}
              rowHeight={rowHeight}
              RowComponent={RowComponent}
              CardComponent={CardComponent}
            />
          )}
        </div>

        <GenericListFooter
          visible={
            viewMode === "list" &&
            (Boolean(footer) || Boolean(footerConfig?.cells?.length))
          }
          rowClassName={footerConfig?.rowClassName}
          layout={footerConfig?.layout}
          columnsTemplate={footerConfig?.columnsTemplate}
          cells={footerConfig?.cells}
          fallback={footer}
        />
      </Section>
    </>
  );
}

export { GenericList };
