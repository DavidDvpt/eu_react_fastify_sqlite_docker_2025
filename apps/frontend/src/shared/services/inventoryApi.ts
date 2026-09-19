import { ApiService } from "@/shared/services/apiCrudService";
import type { ListInventoryStockApiV2InventoryStockGet200 } from "@/api/generated/model";

import type { FinancialInventoryReport } from "@zod-schemas";

export default class IventoryApi extends ApiService<Record<string, never>, ListInventoryStockApiV2InventoryStockGet200, never> {
  protected route = "/inventory";

  async getStock() {
    return await this.axios.get<ListInventoryStockApiV2InventoryStockGet200>(`${this.route}/stock`);
  }
  async getInventoryReport() {
    return await this.axios.get<FinancialInventoryReport>(
      `${this.route}/financial-report`,
    );
  }
}
