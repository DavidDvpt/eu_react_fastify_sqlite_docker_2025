import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GenericListColumn } from "@/shared/types";

type SelectCellProps<T> = {
  column: GenericListColumn<T>;
  row: T;
  value: unknown;
};

function SelectCell<T>({ column, row, value }: SelectCellProps<T>) {
  return (
    <Select
      value={String(value ?? "")}
      disabled={column.disabled?.(row)}
      onValueChange={(nextValue) => column.onSelectChange?.(row, nextValue)}
    >
      <SelectTrigger className="h-8 w-full rounded-md border border-table-border bg-white px-2 text-sm shadow-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="border border-border bg-white shadow-md">
        {(column.selectOptions ?? []).map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="bg-white"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { SelectCell };
