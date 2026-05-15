import { env } from "@/config/env";
import axios from "axios";
import {
  attachPrivateRequestInterceptor,
  attachPrivateResponseInterceptor,
} from "./interceptors";

const baseConfig = {
  baseURL: env.VITE_API_URL,
  timeout: 20_000,
};

const axiosPublicInstance = axios.create(baseConfig);

function axiosInstance() {
  const instance = axios.create({
    ...baseConfig,
    withCredentials: true,
  });

  attachPrivateRequestInterceptor(instance);
  attachPrivateResponseInterceptor(instance);

  return instance;
}

export { axiosInstance, axiosPublicInstance };
