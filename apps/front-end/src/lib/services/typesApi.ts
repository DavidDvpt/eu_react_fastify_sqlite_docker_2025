import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";

import type { typeDtos } from "@eu/types";

const TYPES_ROUTE = "/types";

function getTypeRouteById(id: string) {
  return `${TYPES_ROUTE}/${id}`;
}

function getTypeEditRoute(id: string) {
  return `${TYPES_ROUTE}/${id}`;
}

async function getTypes(): Promise<typeDtos> {
  const response = await axiosCrud(axiosInstance()).get<typeDtos>(TYPES_ROUTE);

  return response;
}

export { getTypeEditRoute, getTypeRouteById, getTypes, TYPES_ROUTE };
