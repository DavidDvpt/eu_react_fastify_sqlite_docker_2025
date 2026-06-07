import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import { parseStock, parseStockDetails } from "@/lib/parsers";

import type {
  Stock,
  StockApi,
  StockDetails,
  StockDetailsApi,
} from "@/shared/types";

const STOCK_ROUTE = "/inventory";

function getStockRouteByItemId(itemId: string) {
  return `${STOCK_ROUTE}/${itemId}`;
}

async function getStock(): Promise<Stock> {
  const response = await axiosCrud(axiosInstance()).get<StockApi>(STOCK_ROUTE);
  return parseStock(response);
}

async function getStockDetails(itemId: string): Promise<StockDetails> {
  const response = await axiosCrud(axiosInstance()).get<StockDetailsApi>(
    `${getStockRouteByItemId(itemId)}?include=details`,
  );
  return parseStockDetails(response);
}

export { getStock, getStockDetails, getStockRouteByItemId, STOCK_ROUTE };
