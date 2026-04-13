import { LotRepository } from './lotRepository.js';
import { ItemCategoryRepository } from './itemCategoryRepository.js';
import { ItemRepository } from './itemRepository.js';
import { ItemTypeRepository } from './itemTypeRepository.js';
import { SeedPatchRepository } from './seedPatchRepository.js';
import { UserRepository } from './userRepository.js';

import type { PrismaModelClient } from './prismaCrudRepository.js';

// Aggregate the delegates we need to build all repositories (works with PrismaClient or TransactionClient).
export type RepositoryClient = PrismaModelClient<'User'> &
  PrismaModelClient<'ItemCategory'> &
  PrismaModelClient<'ItemType'> &
  PrismaModelClient<'Item'> &
  PrismaModelClient<'Lot'> &
  PrismaModelClient<'SeedPatch'>;

// Helper to create every repository from a single Prisma client instance.
export const createRepositories = (client: RepositoryClient) => ({
  user: new UserRepository(client),
  itemCategory: new ItemCategoryRepository(client),
  itemType: new ItemTypeRepository(client),
  item: new ItemRepository(client),
  lot: new LotRepository(client),
  seedPatch: new SeedPatchRepository(client),
});

export {
  LotRepository,
  ItemCategoryRepository,
  ItemRepository,
  ItemTypeRepository,
  SeedPatchRepository,
  UserRepository,
};
