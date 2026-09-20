import type { AxiosError, AxiosRequestConfig } from "axios";

import { axiosInstance } from "@/lib/axios/instances";

type OrvalRequestConfig = AxiosRequestConfig & {
  data?: unknown;
};

/**
 * HTTP mutator used by the generated React Query client.
 *
 * The OpenAPI document exposes the public prefix in every path while the
 * application's Axios instance already uses /api/v2 as its base URL.
 */
export const customInstance = <T>(
  config: OrvalRequestConfig,
  options?: OrvalRequestConfig,
): Promise<T> => {
  const requestConfig = { ...config, ...options };

  if (requestConfig.url?.startsWith("/api/v2")) {
    requestConfig.url = requestConfig.url.slice("/api/v2".length) || "/";
  }

  return axiosInstance()
    .request<T>(requestConfig)
    .then(({ data }) => data);
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;

export default customInstance;
