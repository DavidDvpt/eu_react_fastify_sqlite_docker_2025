import { ObjectHelper } from '@eu/helpers';

import type { NexusUpdate } from '#prisma/generated/client.js';
import type { DatabaseClient } from '#prisma/prismaClient.js';
import type { NexusUpdateDto } from '@eu/types';
export class NexusService {
  constructor(private readonly prisma: DatabaseClient) {}

  async getAll() {
    const result = await this.prisma.nexusUpdate.findMany();

    const parsed = ObjectHelper.snakeToCamelKeys<NexusUpdate[], NexusUpdateDto[]>(result);

    return parsed;
  }
}
