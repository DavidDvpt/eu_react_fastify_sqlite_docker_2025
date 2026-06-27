import { env } from "./env";

type AppRuntimeConfig = {
  API_URL?: string;
  IMAGE_BASE_URL?: string;
};

const runtimeConfig: AppRuntimeConfig =
  typeof window !== "undefined" && window.__APP_CONFIG__
    ? window.__APP_CONFIG__
    : {};

function normalizeBaseUrl(value?: string) {
  return value?.replace(/\/+$/, "") ?? "";
}

function getRuntimeBaseUrl(
  runtimeValue?: string,
  buildValue?: string,
  fallbackValue = "",
) {
  const runtimeBaseUrl = normalizeBaseUrl(runtimeValue);
  if (runtimeBaseUrl) {
    return runtimeBaseUrl;
  }

  const buildBaseUrl = normalizeBaseUrl(buildValue);
  if (buildBaseUrl) {
    return buildBaseUrl;
  }

  return fallbackValue;
}

function getApiBaseUrl() {
  return getRuntimeBaseUrl(runtimeConfig.API_URL, env.VITE_API_URL, "/api/v1");
}

function getImageBaseUrl() {
  return getRuntimeBaseUrl(
    runtimeConfig.IMAGE_BASE_URL,
    env.VITE_IMAGE_BASE_URL,
    "/images",
  );
}

export { getApiBaseUrl, getImageBaseUrl };
