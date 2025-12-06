import type { PrismaModelClient } from "./prismaCrudRepository.js";
import { InventoryLotRepository } from "./inventoryLotRepository.js";
import { InventoryLotTransactionRepository } from "./inventoryLotTransactionRepository.js";
import { ItemCategoryRepository } from "./itemCategoryRepository.js";
import { ItemRepository } from "./itemRepository.js";
import { ItemTypeRepository } from "./itemTypeRepository.js";
import { SeedPatchRepository } from "./seedPatchRepository.js";
import { TransactionRepository } from "./transactionRepository.js";
import { UserRepository } from "./userRepository.js";

// Aggregate the delegates we need to build all repositories (works with PrismaClient or TransactionClient).
export type RepositoryClient = PrismaModelClient<"user"> &
  PrismaModelClient<"item_categories"> &
  PrismaModelClient<"item_types"> &
  PrismaModelClient<"items"> &
  PrismaModelClient<"inventory_lots"> &
  PrismaModelClient<"transactions"> &
  PrismaModelClient<"inventory_lot_transactions"> &
  PrismaModelClient<"seed_patch">;

// Helper to create every repository from a single Prisma client instance.
export const createRepositories = (client: RepositoryClient) => ({
  user: new UserRepository(client),
  itemCategory: new ItemCategoryRepository(client),
  itemType: new ItemTypeRepository(client),
  item: new ItemRepository(client),
  inventoryLot: new InventoryLotRepository(client),
  transaction: new TransactionRepository(client),
  inventoryLotTransaction: new InventoryLotTransactionRepository(client),
  seedPatch: new SeedPatchRepository(client),
});

export {
  UserRepository,
  ItemCategoryRepository,
  ItemTypeRepository,
  ItemRepository,
  InventoryLotRepository,
  TransactionRepository,
  InventoryLotTransactionRepository,
  SeedPatchRepository,
};
