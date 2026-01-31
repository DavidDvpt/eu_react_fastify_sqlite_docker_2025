import { PrismaCrudRepository } from './prismaCrudRepository.js';

import type { PrismaModelClient } from './prismaCrudRepository.js';

type ItemTypeClient = PrismaModelClient<'ItemType'>;

export class ItemTypeRepository extends PrismaCrudRepository<ItemTypeClient['itemType']> {
  constructor(client: ItemTypeClient) {
    super(client.itemType);
  }
}
