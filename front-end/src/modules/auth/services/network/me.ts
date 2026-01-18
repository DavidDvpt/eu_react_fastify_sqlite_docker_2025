import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import { userParser } from "../parsers/userParser";

const API_URL = import.meta.env.VITE_API_URL;

async function me() {
  try {
    const response = await axiosCrud(axiosInstance()).get<UserApi>(
      `${API_URL}/me`
    );

    const parsed = await userParser(response);

    return parsed;
  } catch (error) {
    return Promise.reject(error);
  }
}

export default me;
