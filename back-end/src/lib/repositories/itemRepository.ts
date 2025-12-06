import { PrismaCrudRepository, PrismaModelClient } from "./prismaCrudRepository.js";

type ItemClient = PrismaModelClient<"items">;

export class ItemRepository extends PrismaCrudRepository<ItemClient["items"]> {
  constructor(client: ItemClient) {
    super(client.items);
  }
}
