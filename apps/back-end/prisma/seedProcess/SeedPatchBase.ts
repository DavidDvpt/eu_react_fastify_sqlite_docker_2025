import type { RootDatabaseClient } from '#prisma/prismaClient.js';

export interface SeedPatchType {
  patchId: string;
  name: string;
  run(): Promise<void>;
}

export abstract class SeedPatchBase implements SeedPatchType {
  constructor(protected readonly prismaClient: RootDatabaseClient) {}

  abstract readonly patchId: string;
  abstract readonly name: string;

  async run() {
    await this.insertPatch();
  }

  protected async insertPatch() {
    await this.prismaClient.seedPatch.create({
      data: { id: this.patchId, name: this.name, patch_date: new Date().toISOString() },
    });
  }
}
