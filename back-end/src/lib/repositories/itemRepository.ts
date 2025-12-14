import { PrismaCrudRepository, PrismaModelClient } from './prismaCrudRepository.js';

type ItemClient = PrismaModelClient<'Item'>;

export class ItemRepository extends PrismaCrudRepository<ItemClient['item']> {
  constructor(client: ItemClient) {
    super(client.item);
  }
}
