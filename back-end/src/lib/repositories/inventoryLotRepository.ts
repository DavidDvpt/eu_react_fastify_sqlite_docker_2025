import {
  PrismaCrudRepository,
  PrismaModelClient,
} from "./prismaCrudRepository.js";

type InventoryLotClient = PrismaModelClient<"InventoryLot">;

export class InventoryLotRepository extends PrismaCrudRepository<
  InventoryLotClient["inventoryLot"]
> {
  constructor(client: InventoryLotClient) {
    super(client.inventoryLot);
  }
}
