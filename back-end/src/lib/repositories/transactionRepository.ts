import { PrismaCrudRepository } from './prismaCrudRepository.js';

import type { PrismaModelClient } from './prismaCrudRepository.js';

type TransactionClient = PrismaModelClient<'Transaction'>;

export class TransactionRepository extends PrismaCrudRepository<TransactionClient['transaction']> {
  constructor(client: TransactionClient) {
    super(client.transaction, { readScope: 'user-only' });
  }
}
