import type { ComponentType, ReactNode } from "react";

export type GenericListViewMode = "list" | "card";

export type GenericListColumnKind =
  | "text"
  | "number"
  | "date"
  | "image"
  | "button"
  | "select"
  | "checkbox"
  | "custom";

export type RowRendererProps<T> = {
  row: T;
  onRowClick?: (row: T) => void;
};

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
  imageSrc?: (value: unknown, row: T) => string;
  imageAlt?: (row: T) => string;
  buttonLabel?: string;
  selectOptions?: Array<{ label: string; value: string }>;
  onSelectChange?: (row: T, value: string) => void;
};

export type GenericListFooterCell = {
  key: string;
  content: ReactNode;
  className?: string;
};

export type GenericListFooterConfig = {
  visible?: boolean;
  rowClassName?: string;
  layout?: "grid" | "flex";
  columnsTemplate?: string;
  cells?: GenericListFooterCell[];
};

export type GenericListProps<T> = {
  columns: GenericListColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  allowCardView?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
  cardClassName?: string;
  rowHeight?: number;
  isLoading?: boolean;
  loadingMessage?: string;
  isError?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  footer?: ReactNode;
  footerConfig?: GenericListFooterConfig;
  RowComponent?: ComponentType<RowRendererProps<T>>;
  CardComponent?: ComponentType<RowRendererProps<T>>;
};

export type GenericListHeaderProps<T> = {
  columns: GenericListColumn<T>[];
  visible?: boolean;
  className?: string;
  rowHeight?: number;
  columnsTemplate?: string;
};

export type GenericListBodyProps<T> = {
  columns: GenericListColumn<T>[];
  rows: T[];
  viewMode: GenericListViewMode;
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  className?: string;
  rowClassName?: string;
  cardClassName?: string;
  rowHeight?: number;
  columnsTemplate?: string;
  RowComponent?: ComponentType<RowRendererProps<T>>;
  CardComponent?: ComponentType<RowRendererProps<T>>;
};

export type GenericListFooterProps = {
  visible?: boolean;
  rowClassName?: string;
  layout?: "grid" | "flex";
  columnsTemplate?: string;
  cells?: GenericListFooterCell[];
  fallback?: ReactNode;
};
