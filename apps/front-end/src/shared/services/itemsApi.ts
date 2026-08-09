import {
  type Stock,
  type ItemDto,
  type ItemFormBody,
  type ItemQuerySchema,
} from "@eu/types";
import { itemQuerySchema } from "@eu/zod-schemas";

import { ApiService } from "@/shared/services/apiCrudService";

export default class ItemsApi extends ApiService<
  ItemQuerySchema,
  ItemDto[],
  ItemFormBody
> {
  protected route = "/items";
  protected querySchema = itemQuerySchema;

  async getStock(itemId?: string) {
    if (!itemId) return {};
    return this.axios.get<Stock>(`${this.route}/${itemId}/stock`);
  }
}
