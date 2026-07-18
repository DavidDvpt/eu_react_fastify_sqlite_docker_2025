import PrismaCrudRepository from './prismaCrudRepository.js';

import type { TypeClient } from '../../types/index.js';

export class TypeRepository extends PrismaCrudRepository<TypeClient['type']> {
  constructor(client: TypeClient) {
    super(client.type, { readScope: 'global-and-user' });
  }
}
