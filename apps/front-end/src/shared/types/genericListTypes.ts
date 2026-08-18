import type { GenericListColumn } from "./genericListColumnType";
import type { ComponentType, ReactNode } from "react";

export type GenericListViewMode = "list" | "card";

export type RowRendererProps<T> = {
  row: T;
  onRowClick?: (row: T) => void;
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
  viewMode?: GenericListViewMode | null;
  hasHeader?: boolean;
  onViewModeChange?: (viewMode: GenericListViewMode) => void;
  showViewModeSwitch?: boolean;
  className?: string;
  grow?: boolean;
  headerClassName?: string;
  bodyClassName?: string;
  rowBaseClassName?: string;
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
  rowBaseClassName?: string;
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
