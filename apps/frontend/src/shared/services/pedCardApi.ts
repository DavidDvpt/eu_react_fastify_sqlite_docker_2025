import { axiosInstance } from "@/lib/axios/instances";

import type { CanPayApiV2PedcardCanPayGet200 } from "@/api/generated/model";

export default class PedcardApi {
  async canPay() {
    const response = await axiosInstance().get<CanPayApiV2PedcardCanPayGet200>(
      "/pedcard/can-pay",
    );
    return response.data;
  }
}
