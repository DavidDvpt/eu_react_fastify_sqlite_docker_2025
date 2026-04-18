import PrismaCrudRepository from './prismaCrudRepository.js';

import type { LotClient } from '../../types/index.js';

export class LotRepository extends PrismaCrudRepository<LotClient['lot']> {
  constructor(client: LotClient) {
    super(client.lot, { readScope: 'user-only' });
  }
}
