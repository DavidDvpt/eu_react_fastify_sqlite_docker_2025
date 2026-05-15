import { env } from "@/config/env";
import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import type { LoginOutput } from "@/modules/auth/validations";

const API_URL = env.VITE_API_URL;

async function signinApi(credentials: LoginOutput) {
  try {
    if (!credentials) throw new Error("Params not found");
    if (!credentials.pseudo) throw new Error("Pseudo is undefined");
    if (!credentials.password) throw new Error("Password is undefined");

    const response = await axiosCrud(axiosInstance()).post<
      { message: string },
      LoginOutput
    >(`${API_URL}/auth/signin`, credentials);

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

export default signinApi;
