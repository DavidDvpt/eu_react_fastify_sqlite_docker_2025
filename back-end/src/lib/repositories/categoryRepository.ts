import PrismaCrudRepository from './prismaCrudRepository.js';

import type { CategoryClient } from '../../types/index.js';

export class CategoryRepository extends PrismaCrudRepository<CategoryClient['category']> {
  constructor(client: CategoryClient) {
    super(client.category, { readScope: 'global-and-user' });
  }
}
