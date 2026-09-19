import { toDisplay } from "./utils";

type TextCellProps = {
  value: unknown;
};

function TextCell({ value }: TextCellProps) {
  return <>{toDisplay(value)}</>;
}

export { TextCell };
