import type { ReactNode } from "react";

type StockRow = {
  itemId: string;
  imageUrlId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

type Stock = StockRow[];

type StockLotInApi = {
  id: string;
  lotType: string;
  quantityRemaining: number | string;
  quantityInitial: number | string;
  quantityExported: number | string;
  priceRemaining: number | string;
  dateCreated: string;
  transactionStatus?: "OPENNED" | "CLOSED" | "ARCHIVED";
};

type StockLotIn = {
  id: string;
  lotType: string;
  quantityRemaining: number;
  quantityInitial: number;
  quantityExported: number;
  priceRemaining: number;
  dateCreated: string;
  transactionStatus?: "OPENNED" | "CLOSED" | "ARCHIVED";
};

type StockLotOutApi = {
  id: string;
  dateCreated: string;
  quantity: number | string;
  tt: number | string;
  ttc: number | string;
  saleStatus: string | null;
  transactionStatus?: "OPENNED" | "CLOSED" | "ARCHIVED";
};

type StockLotOut = {
  id: string;
  dateCreated: string;
  quantity: number;
  tt: number;
  ttc: number;
  saleStatus: string | null;
  transactionStatus?: "OPENNED" | "CLOSED" | "ARCHIVED";
};

type StockDetailsPanelProps = {
  onClose: () => void;
  className?: string;
};

type StockDetailsApi = StockRowApi & {
  lotsIn: StockLotInApi[];
  lotsOut: StockLotOutApi[];
};

type StockDetails = StockRow & {
  lotsIn: StockLotIn[];
  lotsOut: StockLotOut[];
};

type StockPanelProps = {
  className?: string;
};

type StockFilterRow = StockRow & {
  itemTypeId: string | null;
  itemTypeName: string | null;
  categoryId: string | null;
  categoryName: string | null;
  isLimited: boolean;
};

type GenericTableColumn<T> = {
  key: string;
  header: string;
  accessor?: keyof T;
  render?: (row: T) => ReactNode;
  headerCellClassName?: string;
  bodyCellClassName?: string;
};

type GenericTableProps<T> = {
  columns: GenericTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  isError?: boolean;
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
  className?: string;
  rowClassName?: string | ((row: T) => string);
  footer?: ReactNode;
};

export type {
  Stock,
  StockApi,
  StockDetails,
  StockDetailsApi,
  StockLotIn,
  StockLotInApi,
  StockLotOut,
  StockLotOutApi,
  StockRow,
  StockRowApi,
  StockPanelProps,
  StockFilterRow,
  GenericTableProps,
  GenericTableColumn,
  StockDetailsPanelProps,
};
