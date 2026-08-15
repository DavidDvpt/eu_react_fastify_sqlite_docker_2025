import type { ReactNode } from "react";

export type GenericListColumnKind =
  | "text"
  | "number"
  | "date"
  | "image"
  | "button"
  | "select"
  | "checkbox"
  | "custom";

export type GenericColumnOnSelectChangeProps<T> = {
  row: T;
  accessor?: keyof T;
  value: string;
};

export type GenericColumnOnSelectChange<T> = {
  bivarianceHack: (props: GenericColumnOnSelectChangeProps<T>) => void;
}["bivarianceHack"];

export type GenericListColumn<T> = {
  key: string;
  label: string;
  kind?: GenericListColumnKind;
  accessor?: keyof T;
  minWidth?: string | number;
  maxWidth?: string | number;
  fillRemainingSpace?: boolean;
  align?: "left" | "center" | "right";
  headerCellClassName?: string;
  bodyCellClassName?: string;
  footerCellClassName?: string;
  value?: (row: T) => ReactNode;
  render?: (row: T) => ReactNode;
  onCellClick?: (row: T) => void;
  disabled?: (row: T) => boolean;
  imageSrc?: (value: unknown, row: T) => string;
  imageAlt?: (row: T) => string;
  buttonLabel?: string;
  selectOptions?: Array<{ label: string; value: string }>;
  isRowPending?: (row: T) => boolean;
  onSelectChange?: GenericColumnOnSelectChange<T>;
};
