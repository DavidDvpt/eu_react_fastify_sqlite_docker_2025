import { PrismaCrudRepository } from './prismaCrudRepository.js';

import type { PrismaModelClient } from './prismaCrudRepository.js';

type CategoryClient = PrismaModelClient<'Category'>;

export class CategoryRepository extends PrismaCrudRepository<CategoryClient['category']> {
  constructor(client: CategoryClient) {
    super(client.category, { readScope: 'global-and-user' });
  }
}
