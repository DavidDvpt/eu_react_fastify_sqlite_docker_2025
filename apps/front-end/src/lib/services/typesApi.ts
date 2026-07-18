import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import { parseTypes } from "@/lib/parsers";

import type { TypeApis, Types } from "@/shared/types";

const TYPES_ROUTE = "/types";

function getTypeRouteById(id: string) {
  return `${TYPES_ROUTE}/${id}`;
}

function getTypeEditRoute(id: string) {
  return `${TYPES_ROUTE}/${id}/edit`;
}

async function getTypes(): Promise<Types> {
  const response = await axiosCrud(axiosInstance()).get<TypeApis>(
    `${TYPES_ROUTE}?include=parent`,
  );

  return parseTypes(response);
}

export { getTypeEditRoute, getTypeRouteById, getTypes, TYPES_ROUTE };
