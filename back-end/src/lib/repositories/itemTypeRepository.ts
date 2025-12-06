import { PrismaCrudRepository, PrismaModelClient } from "./prismaCrudRepository.js";

type ItemTypeClient = PrismaModelClient<"item_types">;

export class ItemTypeRepository extends PrismaCrudRepository<
  ItemTypeClient["item_types"]
> {
  constructor(client: ItemTypeClient) {
    super(client.item_types);
  }
}
