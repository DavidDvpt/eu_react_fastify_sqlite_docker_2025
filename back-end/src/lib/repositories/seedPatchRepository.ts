import { PrismaCrudRepository } from './prismaCrudRepository.js';

import type { PrismaModelClient } from './prismaCrudRepository.js';

type SeedPatchClient = PrismaModelClient<'SeedPatch'>;

export class SeedPatchRepository extends PrismaCrudRepository<SeedPatchClient['seedPatch']> {
  constructor(client: SeedPatchClient) {
    super(client.seedPatch);
  }
}
