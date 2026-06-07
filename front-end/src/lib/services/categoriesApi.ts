import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import { parseCategories } from "@/lib/parsers";

import type { Categories, CategoryApis } from "@/shared/types";

const CATEGORIES_ROUTE = "/categories";

function getCategoryRouteById(id: string) {
  return `${CATEGORIES_ROUTE}/${id}`;
}

function getCategoryEditRoute(id: string) {
  return `${CATEGORIES_ROUTE}/${id}/edit`;
}

async function getCategories(): Promise<Categories> {
  const response =
    await axiosCrud(axiosInstance()).get<CategoryApis>(CATEGORIES_ROUTE);
  return parseCategories(response);
}

export {
  CATEGORIES_ROUTE,
  getCategories,
  getCategoryEditRoute,
  getCategoryRouteById,
};
