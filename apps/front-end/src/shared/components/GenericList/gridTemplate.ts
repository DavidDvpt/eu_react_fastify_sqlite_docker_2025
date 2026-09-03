import type { GenericListColumn } from "./columnDefinition/genericListColumnType";

function toCssSize(value?: string | number): string | undefined {
  if (value === undefined || value === null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

function getGridTemplateColumns<T>(columns: GenericListColumn<T>[]): string {
  return columns
    .map((column) => {
      const minWidth = toCssSize(column.minWidth) ?? "0";
      const maxWidth = toCssSize(column.maxWidth);

      if (column.fillRemainingSpace) {
        return "minmax(0, 1fr)";
      }

      if (maxWidth) {
        return `minmax(${minWidth}, ${maxWidth})`;
      }

      return minWidth;
    })
    .join(" ");
}

export { getGridTemplateColumns };
