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

type SellTradeLineInput = {
  itemId: string;
  quantity: number;
  inventoryLotId?: string;
  tt?: number;
  ttc: number;
};

type SellTradeBody = {
  lines: SellTradeLineInput[];
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

async function sellTrade(body: SellTradeBody): Promise<TradeExecutionResult> {
  return axiosCrud(axiosInstance()).post<TradeExecutionResult, SellTradeBody>(
    `${TRADE_ROUTE}/sell`,
    body,
  );
}

export { purchaseTrade, sellTrade, TRADE_ROUTE };
export type {
  PurchaseTradeBody,
  PurchaseTradeLineInput,
  SellTradeBody,
  SellTradeLineInput,
  TradeExecutionResult,
  TradeProcessedItem,
  TradeRejectedItem,
};
