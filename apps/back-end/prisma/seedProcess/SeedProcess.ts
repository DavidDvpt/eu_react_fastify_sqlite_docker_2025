import type { Prisma, SeedPatch } from '#prisma/generated/client.js';
import type { RootDatabaseClient } from '#prisma/prismaClient.js';
import type { SeedPatchType } from '#prisma/seedProcess/SeedPatchBase.js';
import { env } from '../../src/config/env.js';

export class SeedProcess {
  private readonly systemUserId: string | null = null;
  private seedPatchIds: string[] = [];

  constructor(private readonly prismaClient: RootDatabaseClient) {
    if (!env.SYSTEM_USER_ID) {
      throw new Error('SYSTEM_USER_ID is required');
    }
    this.systemUserId = env.SYSTEM_USER_ID || null;
  }

  async init() {
    const patchs = await this.getSeedPatch();

    return patchs;
  }

  async getSeedPatch() {
    const result = await this.prismaClient.seedPatch.findMany();
    this.seedPatchIds = result.map((patch) => patch.id);
  }

  async runPatches(patches: SeedPatchType[]) {
    for (const patch of patches) {
      if (this.seedPatchIds.includes(patch.patchId)) continue;

      await patch.run();
    }
  }
}
