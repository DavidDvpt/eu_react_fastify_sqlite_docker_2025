import { signupApiV2AuthSignupPost } from "@/api/generated/react-query/entropiaManagerAPI";
import type { SignUpBody } from "@/api/generated/model";

async function signupApi(credentials: SignUpBody) {
  try {
    if (!credentials) throw new Error("Params not found");
    if (!credentials.pseudo) throw new Error("Pseudo is undefined");
    if (!credentials.email) throw new Error("Email is undefined");
    if (!credentials.password) throw new Error("Password is undefined");

    const { firstname, lastname, ...requiredFields } = credentials;
    const payload = {
      ...requiredFields,
      ...(firstname !== undefined ? { firstname } : {}),
      ...(lastname !== undefined ? { lastname } : {}),
    } satisfies SignUpBody;
    const response = await signupApiV2AuthSignupPost(payload);

    // Some backends return `{ user, token? }`, others return the user directly.
    if ("user" in response) return response;
    return { user: response };
  } catch (error) {
    return Promise.reject(error);
  }
}

export default signupApi;
