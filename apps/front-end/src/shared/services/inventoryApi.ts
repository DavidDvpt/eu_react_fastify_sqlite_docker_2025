import { ApiService } from "@/shared/services/apiCrudService";

import type { Stock, StockQuery } from "@eu/types";

export default class IventoryApi extends ApiService<StockQuery, Stock, never> {
  protected route = "/inventory";

  async getStock() {
    return await this.axios.get<Stock>(`${this.route}/stock`);
  }
}
