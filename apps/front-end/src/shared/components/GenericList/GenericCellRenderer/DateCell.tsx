import { toDisplay } from "./utils";

type DateCellProps = {
  value: unknown;
};

function DateCell({ value }: DateCellProps) {
  if (!value) {
    return <>-</>;
  }

  const date = new Date(String(value));

  return (
    <>
      {Number.isNaN(date.getTime())
        ? toDisplay(value)
        : date.toLocaleDateString("fr-FR")}
    </>
  );
}

export { DateCell };
