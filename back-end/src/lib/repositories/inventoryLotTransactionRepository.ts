import { PrismaCrudRepository } from './prismaCrudRepository.js';

import type { PrismaModelClient } from './prismaCrudRepository.js';

type InventoryLotTransactionClient = PrismaModelClient<'InventoryLotTransaction'>;

export class InventoryLotTransactionRepository extends PrismaCrudRepository<
  InventoryLotTransactionClient['inventoryLotTransaction']
> {
  constructor(client: InventoryLotTransactionClient) {
    super(client.inventoryLotTransaction);
  }
}
