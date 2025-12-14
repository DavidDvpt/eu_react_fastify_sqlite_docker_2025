import { PrismaCrudRepository, PrismaModelClient } from './prismaCrudRepository.js';

type ItemTypeClient = PrismaModelClient<'ItemType'>;

export class ItemTypeRepository extends PrismaCrudRepository<ItemTypeClient['itemType']> {
  constructor(client: ItemTypeClient) {
    super(client.itemType);
  }
}
