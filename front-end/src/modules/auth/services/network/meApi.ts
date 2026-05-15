import { env } from "@/config/env";
import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import { meParser } from "../../authParser";

const API_URL = env.VITE_API_URL;

async function meApi() {
  try {
    const response = await axiosCrud(axiosInstance()).get<UserApi>(
      `${API_URL}/auth/me`,
    );

    const parsed = await meParser(response);

    return parsed;
  } catch (error) {
    return Promise.reject(error);
  }
}

export default meApi;
