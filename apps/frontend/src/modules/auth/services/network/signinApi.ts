import { signinApiV2AuthSigninPost } from "@/api/generated/react-query/entropiaManagerAPI";
import type { SignInBody } from "@/api/generated/model";

async function signinApi(credentials: SignInBody) {
  try {
    if (!credentials) throw new Error("Params not found");
    if (!credentials.pseudo) throw new Error("Pseudo is undefined");
    if (!credentials.password) throw new Error("Password is undefined");

    const response = await signinApiV2AuthSigninPost(credentials);

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

export default signinApi;
