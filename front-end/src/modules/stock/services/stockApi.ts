import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import { parseStock } from "../stockParser";

import type { Stock, StockApi } from "../stockTypes";

const API_URL = import.meta.env.VITE_API_URL;
const STOCK_ROUTE = `${API_URL}/stock`;

async function getStock(): Promise<Stock> {
  const response = await axiosCrud(axiosInstance()).get<StockApi>(STOCK_ROUTE);
  return parseStock(response);
}

export { getStock, STOCK_ROUTE };
