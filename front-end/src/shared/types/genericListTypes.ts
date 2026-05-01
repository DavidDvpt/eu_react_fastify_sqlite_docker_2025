import type { ReactNode } from "react";

export type GenericListViewMode = "list" | "card";
export type GenericListAlign = "left" | "center" | "right";
export type GenericListColumnKind = "text" | "image" | "button" | "custom";

export type GenericListColumn<T> = {
  key: string;
  label: string;
  width?: string;
  accessor?: keyof T;
  align?: GenericListAlign;
  kind?: GenericListColumnKind;
  headerClassName?: string;
  cellClassName?: string;
  render?: (row: T) => ReactNode;
};

export type GenericListRowClassName<T> = string | ((row: T) => string);

export type GenericListHeaderProps<T> = {
  columns: GenericListColumn<T>[];
  gridTemplateColumns: string;
  headerHeight?: number;
  showColumns?: boolean;
};

export type GenericListFooterProps = {
  footer?: ReactNode;
  gridTemplateColumns: string;
  footerHeight?: number;
  showColumns?: boolean;
};

export type GenericListBodyProps<T> = {
  columns: GenericListColumn<T>[];
  rows: T[];
  viewMode: GenericListViewMode;
  gridTemplateColumns: string;
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  rowClassName?: GenericListRowClassName<T>;
  rowHeight?: number;
  showColumns?: boolean;
  renderRow?: (row: T) => ReactNode;
  renderCard?: (row: T) => ReactNode;
};

export type GenericListProps<T> = {
  columns: GenericListColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  isError?: boolean;
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
  className?: string;
  bodyClassName?: string;
  rowClassName?: GenericListRowClassName<T>;
  viewMode?: GenericListViewMode;
  allowCardView?: boolean;
  showColumns?: boolean;
  headerHeight?: number;
  footerHeight?: number;
  rowHeight?: number;
  footer?: ReactNode;
  renderRow?: (row: T) => ReactNode;
  renderCard?: (row: T) => ReactNode;
};
