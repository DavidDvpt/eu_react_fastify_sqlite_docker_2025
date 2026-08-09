import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import { ApiService } from "@/shared/services/apiCrudService";
import type {
  PedCardBalanceResponse,
  PedCardResult,
  PedCardCheckResponse,
} from "@/shared/types/pedcard";
import type { PedcardDto, PedCardFormBody } from "@eu/types";

const pedcardRoute = "/pedcard";

export default class pedcardApi extends ApiService<
  Record<string, never>,
  PedcardDto[],
  PedCardFormBody
> {
  protected route = "/pedcard";
  protected querySchema = null;

  //   override get(): Promise<PedCardResult> {
  //   try {
  //     await this.check();
  //     const { balance } = await this.balance();

  //     return {
  //       hasInitialBalance: true,
  //       balance,
  //     };
  //   } catch (error) {
  //     const apiError = error as ApiError;

  //     if (apiError?.status === 400) {
  //       return {
  //         hasInitialBalance: false,
  //         balance: null,
  //       };
  //     }

  //     return Promise.reject(error);
  //   }
  // }
  async check() {
    return axiosCrud(axiosInstance()).get<PedCardCheckResponse>(
      `${pedcardRoute}/can-pay`,
    );
  }
  async balance() {
    return axiosCrud(axiosInstance()).get<PedCardBalanceResponse>(
      `${pedcardRoute}/balance`,
    );
  }
}
