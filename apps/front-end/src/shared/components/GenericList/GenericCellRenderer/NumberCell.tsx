import { toDisplay } from "./utils";

type NumberCellProps = {
  value: unknown;
};

function NumberCell({ value }: NumberCellProps) {
  if (typeof value === "number") {
    return <>{value.toLocaleString("fr-FR")}</>;
  }

  return <>{toDisplay(value)}</>;
}

export { NumberCell };
