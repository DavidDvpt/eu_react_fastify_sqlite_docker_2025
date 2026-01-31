import { PrismaCrudRepository } from './prismaCrudRepository.js';

import type { PrismaModelClient } from './prismaCrudRepository.js';

type ItemClient = PrismaModelClient<'Item'>;

export class ItemRepository extends PrismaCrudRepository<ItemClient['item']> {
  constructor(client: ItemClient) {
    super(client.item);
  }
}
