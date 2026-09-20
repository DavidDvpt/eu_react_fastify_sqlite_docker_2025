import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import { ApiService } from "@/shared/services/apiCrudService";

import type {
  BalanceResponse,
  IdResponse,
  PedcardForm,
  PedcardPatch,
  PedcardResponse,
} from "@/api/generated/model";
import type {
  CanPayApiV2PedcardCanPayGet200,
  CheckPedcardApiV2PedcardCheckGet200,
} from "@/api/generated/model";

const pedcardRoute = "/pedcard";

export default class pedcardApi extends ApiService<
  Record<string, never>,
  PedcardResponse[],
  PedcardForm,
  IdResponse,
  PedcardPatch,
  IdResponse
> {
  protected route = `${pedcardRoute}`;
  protected querySchema = null;

  async check() {
    return axiosCrud(axiosInstance()).get<CheckPedcardApiV2PedcardCheckGet200>(
      `${pedcardRoute}/check`,
    );
  }
  async canPay() {
    return axiosCrud(axiosInstance()).get<CanPayApiV2PedcardCanPayGet200>(
      `${pedcardRoute}/can-pay`,
    );
  }
  async balance() {
    return axiosCrud(axiosInstance()).get<BalanceResponse>(
      `${pedcardRoute}/balance`,
    );
  }
}
