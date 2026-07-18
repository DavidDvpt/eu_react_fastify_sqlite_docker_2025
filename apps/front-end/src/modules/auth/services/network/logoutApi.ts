import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";

async function logoutApi() {
  try {
    const response = await axiosCrud(axiosInstance()).post<
      { message: string },
      Record<string, never>
    >("/auth/logout", {});

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

export default logoutApi;
