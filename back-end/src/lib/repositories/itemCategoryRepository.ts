import { PrismaCrudRepository } from './prismaCrudRepository.js';

import type { PrismaModelClient } from './prismaCrudRepository.js';

type ItemCategoryClient = PrismaModelClient<'ItemCategory'>;

export class ItemCategoryRepository extends PrismaCrudRepository<
  ItemCategoryClient['itemCategory']
> {
  constructor(client: ItemCategoryClient) {
    super(client.itemCategory);
  }
}
