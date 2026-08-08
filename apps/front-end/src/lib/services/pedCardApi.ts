import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import API_ROUTES from "./apiRoutes";
import type {
  PedCardCreateBody,
  PedCardBalanceResponse,
  PedCardResult,
  PedCardCheckResponse,
} from "@/shared/types/pedcard";

async function pedCardCheck() {
  return axiosCrud(axiosInstance()).get<PedCardCheckResponse>(
    "/pedcard/can-pay",
  );
}

async function pedCardBalance() {
  return axiosCrud(axiosInstance()).get<PedCardBalanceResponse>(
    API_ROUTES.pedCardBalanceRoute,
  );
}

async function createPedCardEntry(body: PedCardCreateBody): Promise<void> {
  await axiosCrud(axiosInstance()).post<void, PedCardCreateBody>(
    API_ROUTES.pedCardCreateRoute,
    body,
  );
}

async function getPedCard(): Promise<PedCardResult> {
  try {
    await pedCardCheck();
    const { balance } = await pedCardBalance();

    return {
      hasInitialBalance: true,
      balance,
    };
  } catch (error) {
    const apiError = error as ApiError;

    if (apiError?.status === 400) {
      return {
        hasInitialBalance: false,
        balance: null,
      };
    }

    return Promise.reject(error);
  }
}

export { createPedCardEntry, getPedCard, pedCardBalance, pedCardCheck };
