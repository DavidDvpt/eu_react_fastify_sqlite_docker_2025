import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";

import type { CategoryDto } from "@eu/types";

const CATEGORIES_ROUTE = "/categories";

function getCategoryByIdRoute(id: string) {
  return `${CATEGORIES_ROUTE}/${id}`;
}

function getCategoryEditRoute(id: string) {
  return `${CATEGORIES_ROUTE}/${id}`;
}

async function getCategories(): Promise<CategoryDto[]> {
  const response =
    await axiosCrud(axiosInstance()).get<CategoryDto[]>(CATEGORIES_ROUTE);

  return response;
}

export {
  CATEGORIES_ROUTE,
  getCategories,
  getCategoryEditRoute,
  getCategoryByIdRoute,
};
