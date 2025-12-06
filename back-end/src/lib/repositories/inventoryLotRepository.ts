import { PrismaCrudRepository, PrismaModelClient } from "./prismaCrudRepository.js";

type InventoryLotClient = PrismaModelClient<"inventory_lots">;

export class InventoryLotRepository extends PrismaCrudRepository<
  InventoryLotClient["inventory_lots"]
> {
  constructor(client: InventoryLotClient) {
    super(client.inventory_lots);
  }
}
