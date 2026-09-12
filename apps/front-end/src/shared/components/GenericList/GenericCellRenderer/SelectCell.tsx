import type { GenericListColumn } from "@/shared/types";
import AppSelect from "@/shared/components/form/Select/AppSelect";

type SelectCellProps<T> = {
  column: GenericListColumn<T>;
  row: T;
  value: unknown;
};

function SelectCell<T>({ column, row, value }: SelectCellProps<T>) {
  return (
    <AppSelect
      value={String(value ?? "")}
      disabled={column.disabled?.(row)}
      options={column.selectOptions ?? []}
      muted
      triggerClassName="mt-0 h-8 rounded-md border-table-border px-2 text-sm shadow-sm"
      onValueChange={(nextValue) =>
        column.onSelectChange?.({
          row,
          accessor: column.accessor,
          value: nextValue,
        })
      }
      contentClassName="border border-border shadow-md"
      itemClassName="bg-surface"
    />
  );
}

export { SelectCell };
