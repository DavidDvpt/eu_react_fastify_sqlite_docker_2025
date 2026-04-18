import { CategoryRepository } from './categoryRepository.js';
import { ItemRepository } from './itemRepository.js';
import { LotRepository } from './lotRepository.js';
import { SeedPatchRepository } from './seedPatchRepository.js';
import { TypeRepository } from './typeRepository.js';
import { UserRepository } from './userRepository.js';

import type { RepositoryClient } from '../../types/index.js';

// Aggregate the delegates we need to build all repositories (works with PrismaClient or TransactionClient).

// Helper to create every repository from a single Prisma client instance.
export const createRepositories = (client: RepositoryClient) => ({
  user: new UserRepository(client),
  itemCategory: new CategoryRepository(client),
  itemType: new TypeRepository(client),
  item: new ItemRepository(client),
  lot: new LotRepository(client),
  seedPatch: new SeedPatchRepository(client),
});

export {
  LotRepository,
  CategoryRepository,
  ItemRepository,
  TypeRepository,
  SeedPatchRepository,
  UserRepository,
};
