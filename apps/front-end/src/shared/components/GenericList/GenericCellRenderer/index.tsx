import type { GenericListColumn } from "@/shared/types";
import { ButtonCell } from "./ButtonCell";
import { CheckboxCell } from "./CheckboxCell";
import { DateCell } from "./DateCell";
import { ImageCell } from "./ImageCell";
import { NumberCell } from "./NumberCell";
import { SelectCell } from "./SelectCell";
import { TextCell } from "./TextCell";

type GenericCellRendererProps<T> = {
  column: GenericListColumn<T>;
  row: T;
};

function getRawValue<T>(column: GenericListColumn<T>, row: T): unknown {
  if (column.value) return column.value(row);
  const key = column.accessor ?? (column.key as keyof T);
  return row[key];
}

function GenericCellRenderer<T>({ column, row }: GenericCellRendererProps<T>) {
  if (column.render) return <>{column.render(row)}</>;

  const raw = getRawValue(column, row);

  switch (column.kind ?? "text") {
    case "number":
      return <NumberCell value={raw} />;
    case "date":
      return <DateCell value={raw} />;
    case "image": {
      const imageUrl = column.imageSrc
        ? column.imageSrc(raw, row)
        : typeof raw === "string"
          ? raw
          : "";

      return (
        <ImageCell
          imageUrl={
            typeof imageUrl === "string" && imageUrl.trim() !== ""
              ? imageUrl
              : null
          }
          alt={column.imageAlt ? column.imageAlt(row) : column.label}
        />
      );
    }
    case "button":
      return <ButtonCell column={column} row={row} value={raw} />;
    case "select":
      return <SelectCell column={column} row={row} value={raw} />;
    case "checkbox":
      return <CheckboxCell column={column} row={row} value={raw} />;
    case "custom":
    case "text":
    default:
      return <TextCell value={raw} />;
  }
}

export { GenericCellRenderer };
