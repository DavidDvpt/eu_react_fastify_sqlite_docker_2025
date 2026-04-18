import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";

type PurchaseTradeLineInput = {
  itemId: string;
  quantity: number;
  tt?: number;
  ttc: number;
};

type PurchaseTradeBody = {
  lines: PurchaseTradeLineInput[];
};

type TradeProcessedItem = {
  itemId: string;
  quantity: number;
};

type TradeRejectedItem = {
  itemId: string;
  requestedQuantity: number;
  availableQuantity: number;
  reason: string;
};

type TradeExecutionResult = {
  sessionId: string | null;
  processed: TradeProcessedItem[];
  rejected: TradeRejectedItem[];
  message?: string;
};

const API_URL = import.meta.env.VITE_API_URL;
const TRADE_ROUTE = `${API_URL}/trade`;

async function purchaseTrade(body: PurchaseTradeBody): Promise<TradeExecutionResult> {
  return axiosCrud(axiosInstance()).post<TradeExecutionResult, PurchaseTradeBody>(
    `${TRADE_ROUTE}/purchase`,
    body,
  );
}

export { purchaseTrade, TRADE_ROUTE };
export type {
  PurchaseTradeBody,
  PurchaseTradeLineInput,
  TradeExecutionResult,
  TradeProcessedItem,
  TradeRejectedItem,
};
