import PrismaCrudRepository from './prismaCrudRepository.js';

import type { ItemClient } from '../../types/index.js';

export class ItemRepository extends PrismaCrudRepository<ItemClient['item']> {
  constructor(client: ItemClient) {
    super(client.item, { readScope: 'global-and-user' });
  }
}
