import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import type { UserSignupFormBody } from "@eu/zod-schemas";

async function signupApi(credentials: UserSignupFormBody) {
  try {
    if (!credentials) throw new Error("Params not found");
    if (!credentials.pseudo) throw new Error("Pseudo is undefined");
    if (!credentials.email) throw new Error("Email is undefined");
    if (!credentials.password) throw new Error("Password is undefined");

    const response = await axiosCrud(axiosInstance()).post<
      { userId: string },
      UserSignupFormBody
    >("/auth/signup", credentials);

    // Some backends return `{ user, token? }`, others return the user directly.
    if ("user" in response) return response;
    return { user: response };
  } catch (error) {
    return Promise.reject(error);
  }
}

export default signupApi;
