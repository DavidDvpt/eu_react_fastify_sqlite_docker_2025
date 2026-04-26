import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import { parseItems } from "../../../lib/parsers/itemParser";
import type { ItemApis, Items } from "@/shared/types";

const API_URL = import.meta.env.VITE_API_URL;
const ITEMS_ROUTE = `${API_URL}/items`;

function getItemRouteById(id: string) {
  return `${API_URL}/items/${id}`;
}

function getItemEditRoute(id: string) {
  return `${API_URL}/items/${id}/edit`;
}

async function getItems(): Promise<Items> {
  const response = await axiosCrud(axiosInstance()).get<ItemApis>(
    `${ITEMS_ROUTE}?include=parent`,
  );
  return parseItems(response);
}

export { getItemEditRoute, getItemRouteById, getItems, ITEMS_ROUTE };
