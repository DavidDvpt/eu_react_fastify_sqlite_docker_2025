import PrismaCrudRepository from './prismaCrudRepository.js';

import type { SeedPatchClient } from '../../types/index.js';

export class SeedPatchRepository extends PrismaCrudRepository<SeedPatchClient['seedPatch']> {
  constructor(client: SeedPatchClient) {
    super(client.seedPatch);
  }
}
