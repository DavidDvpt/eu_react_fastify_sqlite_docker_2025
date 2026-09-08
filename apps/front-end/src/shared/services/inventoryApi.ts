import { ApiService } from "@/shared/services/apiCrudService";

import type { FinancialInventoryReport } from "@eu/types";
import type { Stock, StockQuery } from "@eu/zod-schemas";

export default class IventoryApi extends ApiService<StockQuery, Stock, never> {
  protected route = "/inventory";

  async getStock() {
    return await this.axios.get<Stock>(`${this.route}/stock`);
  }
  async getInventoryReport() {
    return await this.axios.get<FinancialInventoryReport>(
      `${this.route}/financial-report`,
    );
  }
}
