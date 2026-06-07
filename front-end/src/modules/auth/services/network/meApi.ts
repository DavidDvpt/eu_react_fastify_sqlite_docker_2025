import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import { meParser } from "../../authParser";

async function meApi() {
  try {
    const response = await axiosCrud(axiosInstance()).get<UserApi>(
      "/auth/me",
    );

    const parsed = await meParser(response);

    return parsed;
  } catch (error) {
    return Promise.reject(error);
  }
}

export default meApi;
