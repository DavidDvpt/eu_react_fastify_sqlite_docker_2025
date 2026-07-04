import type { GenericListColumn } from "@/shared/types";
import { toDisplay } from "./utils";

type ButtonCellProps<T> = {
  column: GenericListColumn<T>;
  row: T;
  value: unknown;
};

function ButtonCell<T>({ column, row, value }: ButtonCellProps<T>) {
  return (
    <button
      type="button"
      className="rounded border border-table-border px-2 py-1"
      disabled={column.disabled?.(row)}
      onClick={() => column.onCellClick?.(row)}
    >
      {column.buttonLabel ?? toDisplay(value)}
    </button>
  );
}

export { ButtonCell };
