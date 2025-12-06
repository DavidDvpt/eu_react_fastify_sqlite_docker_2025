import { PrismaCrudRepository, PrismaModelClient } from "./prismaCrudRepository.js";

type InventoryLotTransactionClient = PrismaModelClient<"inventory_lot_transactions">;

export class InventoryLotTransactionRepository extends PrismaCrudRepository<
  InventoryLotTransactionClient["inventory_lot_transactions"]
> {
  constructor(client: InventoryLotTransactionClient) {
    super(client.inventory_lot_transactions);
  }
}
