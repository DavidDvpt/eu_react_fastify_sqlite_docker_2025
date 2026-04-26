import type { GenericTableColumn } from "@/shared/types";
import type { ReactNode } from "react";

const DEFAULT_HEADER_CLASS =
  "px-4 py-3 font-semibold text-table-head-text bg-table-head-bg";
const DEFAULT_CELL_CLASS = "px-4 py-1.5 h-10 text-table-body-text";
const IMAGE_COLUMN_SIZE_CLASS = "w-[32px] min-w-[32px] max-w-[32px] px-0";
const DEFAULT_ROW_CLASS =
  "border-b border-table-border text-table-head-text last:border-b-0 odd:bg-table-row-odd-bg even:bg-table-row-even-bg hover:bg-table-row-hover-bg cursor-pointer";
const DEFAULT_FOOTER_CLASS =
  "sticky bottom-0 z-20 bg-table-foot-bg px-4 py-3 text-right text-sm font-semibold text-table-foot-text";

function toDisplayValue(value: unknown): ReactNode {
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  return value as ReactNode;
}

function isImageColumn<T>(column: GenericTableColumn<T>): boolean {
  const key = column.key.toLowerCase();
  const accessor =
    typeof column.accessor === "string" ? column.accessor.toLowerCase() : "";

  return key.includes("image") || accessor.includes("image");
}

export {
  DEFAULT_HEADER_CLASS,
  DEFAULT_CELL_CLASS,
  IMAGE_COLUMN_SIZE_CLASS,
  DEFAULT_ROW_CLASS,
  DEFAULT_FOOTER_CLASS,
  toDisplayValue,
  isImageColumn,
};
