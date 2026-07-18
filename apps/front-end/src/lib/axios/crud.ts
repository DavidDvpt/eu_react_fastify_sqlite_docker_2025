/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AxiosInstance, AxiosRequestConfig } from "axios";

function axiosCrud(client: AxiosInstance) {
  return {
    get: async <T, Q extends QueryParams | undefined = undefined>(
      url: string,
      config?: AxiosRequestConfig<Q>
    ) => (await client.get<T>(url, config)).data,
    post: async <T, B extends JsonBody>(
      url: string,
      body: B,
      config?: AxiosRequestConfig<any>
    ) => (await client.post<T>(url, body, config)).data,

    put: async <T, B extends JsonBody>(
      url: string,
      body: 
      B,
      config?: AxiosRequestConfig<any>
    ) => (await client.put<T>(url, body, config)).data,

    patch: async <T, B extends JsonBody>(
      url: string,
      body: B,
      config?: AxiosRequestConfig<any>
    ) => (await client.patch<T>(url, body, config)).data,

    del: async <T>(url: string, config?: AxiosRequestConfig<any>) =>
      (await client.delete<T>(url, config)).data,
  };
}

export { axiosCrud };
