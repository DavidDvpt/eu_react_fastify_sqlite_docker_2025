import { logoutApiV2AuthLogoutPost } from "@/api/generated/react-query/entropiaManagerAPI";

async function logoutApi() {
  try {
    const response = await logoutApiV2AuthLogoutPost();

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

export default logoutApi;
