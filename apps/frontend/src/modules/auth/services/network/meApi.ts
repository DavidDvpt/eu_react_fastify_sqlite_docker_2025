import { meApiV2AuthMeGet } from "@/api/generated/react-query/entropiaManagerAPI";
import { meParser } from "../../authParser";

async function meApi() {
  try {
    const response = await meApiV2AuthMeGet();

    const parsed = await meParser(response);

    return parsed;
  } catch (error) {
    return Promise.reject(error);
  }
}

export default meApi;
