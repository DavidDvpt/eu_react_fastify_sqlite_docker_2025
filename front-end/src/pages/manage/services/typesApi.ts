import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import { parseTypes } from "../../../lib/parsers/typeParser";

import type { TypeApis, Types } from "@/shared/types";

const API_URL = import.meta.env.VITE_API_URL;
const TYPES_ROUTE = `${API_URL}/types`;

function getTypeRouteById(id: string) {
  return `${API_URL}/types/${id}`;
}

function getTypeEditRoute(id: string) {
  return `${API_URL}/types/${id}/edit`;
}

async function getTypes(): Promise<Types> {
  const response = await axiosCrud(axiosInstance()).get<TypeApis>(
    `${TYPES_ROUTE}?include=parent`,
  );
  return parseTypes(response);
}

export { getTypeEditRoute, getTypeRouteById, getTypes, TYPES_ROUTE };
