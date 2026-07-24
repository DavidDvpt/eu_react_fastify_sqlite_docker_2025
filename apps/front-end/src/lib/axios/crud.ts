import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

function axiosCrud(client: AxiosInstance) {
  return {
    get: async <T>(url: string, config?: AxiosRequestConfig) =>
      (await client.get<T>(url, config)).data,

    post: async <T, B>(url: string, body: B, config?: AxiosRequestConfig<B>) =>
      (await client.post<T, AxiosResponse<T>, B>(url, body, config)).data,

    put: async <T, B>(url: string, body: B, config?: AxiosRequestConfig<B>) =>
      (await client.put<T, AxiosResponse<T>, B>(url, body, config)).data,

    patch: async <T, B>(url: string, body: B, config?: AxiosRequestConfig<B>) =>
      (await client.patch<T, AxiosResponse<T>, B>(url, body, config)).data,

    del: async <T>(url: string, config?: AxiosRequestConfig) =>
      (await client.delete<T>(url, config)).data,
  };
}

export { axiosCrud };
