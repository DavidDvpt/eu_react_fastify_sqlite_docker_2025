import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import { parseCategories } from "../../../lib/parsers/categoryParser";

import type { Categories, CategoryApis } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;
const CATEGORIES_ROUTE = `${API_URL}/categories`;

function getCategoryRouteById(id: string) {
  return `${API_URL}/categories/${id}`;
}

function getCategoryEditRoute(id: string) {
  return `${API_URL}/categories/${id}/edit`;
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
