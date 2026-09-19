import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";

function attachPrivateRequestInterceptor(request: AxiosInstance) {
  request.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => Promise.reject(error),
  );
}

function responseResult<T>(res: AxiosResponse<T>) {
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
  const requestUrl = err.config?.url ?? "";
  const isMeRequest = requestUrl.includes("/auth/me");

  if (
    status === 401 &&
    isMeRequest &&
    typeof window !== "undefined" &&
    window.location.pathname !== "/auth/signin"
  ) {
    window.location.replace("/auth/signin");
  }

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
