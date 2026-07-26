import { SeedPatchRepository } from './index.js';

import type { RepositoryClient } from '../../types/index.js';

// Aggregate the delegates we need to build all repositories (works with PrismaClient or TransactionClient).

// Helper to create every repository from a single Prisma client instance.
const createRepositories = (client: RepositoryClient) => ({
  seedPatch: new SeedPatchRepository(client),
});

export { createRepositories };
