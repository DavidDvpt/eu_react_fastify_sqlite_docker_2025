import type { ReactNode } from "react";
import type { GenericListColumn } from "../../types/genericListTypes";

type GenericCellRendererProps<T> = {
  column: GenericListColumn<T>;
  row: T;
};

function toDisplay(value: unknown): ReactNode {
  if (value === null || value === undefined || value === "") return "-";
  return value as ReactNode;
}

function getRawValue<T>(column: GenericListColumn<T>, row: T): unknown {
  if (column.value) return column.value(row);
  const key = column.accessor ?? (column.key as keyof T);
  return row[key];
}

function GenericCellRenderer<T>({ column, row }: GenericCellRendererProps<T>) {
  if (column.render) return <>{column.render(row)}</>;

  const raw = getRawValue(column, row);

  switch (column.kind ?? "text") {
    case "number": {
      if (typeof raw === "number") return <>{raw.toLocaleString("fr-FR")}</>;
      return <>{toDisplay(raw)}</>;
    }
    case "date": {
      if (!raw) return <>-</>;
      const date = new Date(String(raw));
      return (
        <>
          {Number.isNaN(date.getTime())
            ? String(raw)
            : date.toLocaleDateString("fr-FR")}
        </>
      );
    }
    case "image": {
      const src = column.imageSrc
        ? column.imageSrc(raw, row)
        : String(raw ?? "");
      if (typeof src !== "string" || src.trim() === "") return <>-</>;
      return (
        <img
          src={src}
          alt={column.imageAlt ? column.imageAlt(row) : column.label}
          className="h-8 w-8 rounded object-contain"
          loading="lazy"
        />
      );
    }
    case "button": {
      return (
        <button
          type="button"
          className="rounded border border-table-border px-2 py-1"
          onClick={() => column.onCellClick?.(row)}
        >
          {column.buttonLabel ?? toDisplay(raw)}
        </button>
      );
    }
    case "select": {
      return (
        <select
          className="rounded border border-table-border bg-transparent px-2 py-1"
          value={String(raw ?? "")}
          onChange={(event) => column.onSelectChange?.(row, event.target.value)}
        >
          {(column.selectOptions ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
    case "checkbox": {
      return (
        <input
          type="checkbox"
          checked={Boolean(raw)}
          onChange={() => column.onCellClick?.(row)}
        />
      );
    }
    case "custom":
    case "text":
    default:
      return <>{toDisplay(raw)}</>;
  }
}

export { GenericCellRenderer };
