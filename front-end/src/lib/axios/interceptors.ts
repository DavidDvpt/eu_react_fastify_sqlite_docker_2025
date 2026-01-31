/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";

function attachPrivateRequestInterceptor(request: AxiosInstance) {
  request.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => Promise.reject(error),
  );
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
function responseResult(res: AxiosResponse<any, any, {}>) {
  return res;
}

async function responseError(err: AxiosError<BackendErrorBody>) {
  if (!err.response) {
    return Promise.reject<ApiError>({
      status: 0,
      message: "Network error",
      info: err.message,
    });
  }

  const { status, response, message } = err;

  const info = response.data?.message ?? "inconnu";

  return Promise.reject<ApiError>({
    status,
    message,
    info,
  });
}

function attachPrivateResponseInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(responseResult, responseError);
}

export { attachPrivateRequestInterceptor, attachPrivateResponseInterceptor };
