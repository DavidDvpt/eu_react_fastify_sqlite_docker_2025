import type { ReactNode } from "react";

type GenericListViewMode = "list" | "card";
type GenericListAlign = "left" | "center" | "right";
type GenericListColumnKind = "text" | "image" | "button" | "custom";

type GenericListColumn<T> = {
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

type GenericListRowClassName<T> = string | ((row: T) => string);

type GenericListHeaderProps<T> = {
  columns: GenericListColumn<T>[];
  gridTemplateColumns: string;
  headerHeight?: number;
  showColumns?: boolean;
};

type GenericListFooterProps = {
  footer?: ReactNode;
  gridTemplateColumns: string;
  footerHeight?: number;
  showColumns?: boolean;
};

type GenericListBodyProps<T> = {
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

type GenericListProps<T> = {
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

export type {
  GenericListAlign,
  GenericListBodyProps,
  GenericListColumn,
  GenericListColumnKind,
  GenericListFooterProps,
  GenericListHeaderProps,
  GenericListProps,
  GenericListRowClassName,
  GenericListViewMode,
};
