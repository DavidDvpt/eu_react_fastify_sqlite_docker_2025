import type { RootDatabaseClient } from '#prisma/prismaClient.js';

export interface SeedPatchType {
  patchId: string;
  run(): Promise<void>;
}

export abstract class SeedPatchBase implements SeedPatchType {
  constructor(protected readonly prismaClient: RootDatabaseClient) {}

  abstract readonly patchId: string;

  async run() {}
}
