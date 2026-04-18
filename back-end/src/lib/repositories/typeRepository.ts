import { PrismaCrudRepository } from './prismaCrudRepository.js';

import type { PrismaModelClient } from './prismaCrudRepository.js';

type TypeClient = PrismaModelClient<'Type'>;

export class TypeRepository extends PrismaCrudRepository<TypeClient['type']> {
  constructor(client: TypeClient) {
    super(client.type, { readScope: 'global-and-user' });
  }
}
