import type { AxiosError, AxiosRequestConfig } from "axios";

import {
  axiosInstance,
  axiosPublicInstance,
} from "@/lib/axios/instances";

type OrvalRequestConfig = AxiosRequestConfig & {
  data?: unknown;
};

const publicRoutes = new Set([
  "/api/v2/auth/signin",
  "/api/v2/auth/signup",
]);

function isPublicRoute(url?: string) {
  const path = url?.split("?", 1)[0];
  return path !== undefined && publicRoutes.has(path);
}

/** HTTP mutator used by the generated React Query client. */
export const customInstance = <T>(
  config: OrvalRequestConfig,
  options?: OrvalRequestConfig,
): Promise<T> => {
  const requestConfig = { ...config, ...options };

  const client = isPublicRoute(requestConfig.url)
    ? axiosPublicInstance
    : axiosInstance();

  return client
    .request<T>(requestConfig)
    .then(({ data }) => data);
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;

export default customInstance;
