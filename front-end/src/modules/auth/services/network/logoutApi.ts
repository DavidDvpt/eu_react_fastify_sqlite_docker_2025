import { env } from "@/config/env";
import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";

const API_URL = env.VITE_API_URL;

async function logoutApi() {
  try {
    const response = await axiosCrud(axiosInstance()).post<
      { message: string },
      Record<string, never>
    >(`${API_URL}/auth/logout`, {});

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

export default logoutApi;
