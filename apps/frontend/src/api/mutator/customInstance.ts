import type { AxiosError, AxiosRequestConfig } from "axios";

import { axiosInstance } from "@/lib/axios/instances";

type OrvalRequestConfig = AxiosRequestConfig & {
  data?: unknown;
};

/** HTTP mutator used by the generated React Query client. */
export const customInstance = <T>(
  config: OrvalRequestConfig,
  options?: OrvalRequestConfig,
): Promise<T> => {
  const requestConfig = { ...config, ...options };

  return axiosInstance()
    .request<T>(requestConfig)
    .then(({ data }) => data);
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;

export default customInstance;
