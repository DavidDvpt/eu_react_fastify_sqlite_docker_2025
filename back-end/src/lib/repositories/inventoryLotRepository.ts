import { PrismaCrudRepository } from './prismaCrudRepository.js';

import type { PrismaModelClient } from './prismaCrudRepository.js';

type InventoryLotClient = PrismaModelClient<'InventoryLot'>;

export class InventoryLotRepository extends PrismaCrudRepository<
  InventoryLotClient['inventoryLot']
> {
  constructor(client: InventoryLotClient) {
    super(client.inventoryLot, { readScope: 'user-only' });
  }
}
