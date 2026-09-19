import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import type { SignInBody } from "@/api/generated/model";

async function signinApi(credentials: SignInBody) {
  try {
    if (!credentials) throw new Error("Params not found");
    if (!credentials.pseudo) throw new Error("Pseudo is undefined");
    if (!credentials.password) throw new Error("Password is undefined");

    const response = await axiosCrud(axiosInstance()).post<
      { message: string },
      SignInBody
    >("/auth/signin", credentials);

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

export default signinApi;
