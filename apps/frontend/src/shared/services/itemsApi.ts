import type { ItemCreate, ItemPatch } from "@/api/generated/model";
import type { ListItemsApiV2ItemsGetParams } from "@/api/generated/model";
import type { GetItemStockApiV2ItemsIdStockGet200 } from "@/api/generated/model";
import { ListItemsApiV2ItemsGetParams as listItemsParamsSchema } from "@/api/generated/zod/model/listItemsApiV2ItemsGetParams.zod";
import {
  type ItemDtos,
  type LotDto,
  type LotSortKey,
  type SortOptions,
} from "@zod-schemas";

import { ApiService } from "@/shared/services/apiCrudService";

export default class ItemsApi extends ApiService<
  ListItemsApiV2ItemsGetParams,
  ItemDtos,
  ItemCreate,
  void,
  ItemPatch
> {
  protected route = "/items";
  protected querySchema = listItemsParamsSchema;

  async getStock(itemId?: string) {
    if (!itemId) return {};
    return this.axios.get<GetItemStockApiV2ItemsIdStockGet200>(`${this.route}/${itemId}/stock`);
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
