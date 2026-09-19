import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import { ApiService } from "@/shared/services/apiCrudService";

import type {
  PedcardBalance,
  PedcardCanPay,
  PedcardCheck,
  PedcardDto,
  PedcardFormBody,
} from "@eu/zod-schemas";

const pedcardRoute = "/pedcard";

export default class pedcardApi extends ApiService<
  Record<string, never>,
  PedcardDto[],
  PedcardFormBody
> {
  protected route = `${pedcardRoute}`;
  protected querySchema = null;

  async check() {
    return axiosCrud(axiosInstance()).get<PedcardCheck>(
      `${pedcardRoute}/check`,
    );
  }
  async canPay() {
    return axiosCrud(axiosInstance()).get<PedcardCanPay>(
      `${pedcardRoute}/can-pay`,
    );
  }
  async balance() {
    return axiosCrud(axiosInstance()).get<PedcardBalance>(
      `${pedcardRoute}/balance`,
    );
  }
}
