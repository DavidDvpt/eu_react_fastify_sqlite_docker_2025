import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import { parseItems } from "@/lib/parsers";
import type { ItemApis, Items } from "@/shared/types";

const ITEMS_ROUTE = "/items";

function getItemRouteById(id: string) {
  return `${ITEMS_ROUTE}/${id}`;
}

function getItemEditRoute(id: string) {
  return `${ITEMS_ROUTE}/${id}`;
}

async function getItems(): Promise<Items> {
  const response = await axiosCrud(axiosInstance()).get<ItemApis>(
    ITEMS_ROUTE,
  );
  return parseItems(response);
}

export { getItemEditRoute, getItemRouteById, getItems, ITEMS_ROUTE };
