import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import { parseStock, parseStockDetails } from "../stockParser";

import type { Stock, StockApi, StockDetails, StockDetailsApi } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;
const STOCK_ROUTE = `${API_URL}/stock`;

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
