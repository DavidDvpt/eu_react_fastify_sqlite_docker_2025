import type { GenericListColumn } from "@/shared/types";

type CheckboxCellProps<T> = {
  column: GenericListColumn<T>;
  row: T;
  value: unknown;
};

function CheckboxCell<T>({ column, row, value }: CheckboxCellProps<T>) {
  return (
    <input
      type="checkbox"
      checked={Boolean(value)}
      disabled={column.disabled?.(row)}
      onChange={() => column.onCellClick?.(row)}
    />
  );
}

export { CheckboxCell };
