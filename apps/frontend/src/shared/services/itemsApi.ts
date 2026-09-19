import type { ItemCreate, ItemPatch } from "@/api/generated/model";
import {
  itemQuerySchema,
  type ItemDtos,
  type ItemQuery,
  type LotDto,
  type LotSortKey,
  type SortOptions,
  type Stock,
} from "@zod-schemas";

import { ApiService } from "@/shared/services/apiCrudService";

export default class ItemsApi extends ApiService<
  ItemQuery,
  ItemDtos,
  ItemCreate,
  void,
  ItemPatch
> {
  protected route = "/items";
  protected querySchema = itemQuerySchema;

  async getStock(itemId?: string) {
    if (!itemId) return {};
    return this.axios.get<Stock>(`${this.route}/${itemId}/stock`);
  }

  async getLots({
    itemId,
    isActive,
    sort = { key: "createdAt", order: "asc" },
  }: {
    itemId?: string;
    isActive?: boolean;
    sort?: SortOptions<LotSortKey>;
  }) {
    if (!itemId) return null;

    return this.axios.get<LotDto[]>(`${this.route}/${itemId}/lots`, {
      params: { isActive, sort, hasInitialValue: true },
    });
  }
}