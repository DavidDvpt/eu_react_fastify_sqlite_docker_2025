import { PrismaCrudRepository } from './prismaCrudRepository.js';

import type { PrismaModelClient } from './prismaCrudRepository.js';

type LotClient = PrismaModelClient<'Lot'>;

export class LotRepository extends PrismaCrudRepository<
  LotClient['lot']
> {
  constructor(client: LotClient) {
    super(client.lot, { readScope: 'user-only' });
  }
}
