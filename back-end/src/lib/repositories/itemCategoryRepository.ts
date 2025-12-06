import { PrismaCrudRepository, PrismaModelClient } from "./prismaCrudRepository.js";

type ItemCategoryClient = PrismaModelClient<"item_categories">;

export class ItemCategoryRepository extends PrismaCrudRepository<
  ItemCategoryClient["item_categories"]
> {
  constructor(client: ItemCategoryClient) {
    super(client.item_categories);
  }
}
