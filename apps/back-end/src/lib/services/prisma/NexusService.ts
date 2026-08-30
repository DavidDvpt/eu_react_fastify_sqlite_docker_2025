import { nexusDtoSchema } from '@eu/zod-schemas';

import type { DatabaseClient } from '#prisma/prismaClient.js';
import type { NexusUpdateWithTypeName } from '#src/types/prismaApi/nexus.js';
import type { NexusUpdateDto } from '@eu/types';

export class NexusService {
  constructor(private readonly prisma: DatabaseClient) {}

  private parser(row: NexusUpdateWithTypeName): NexusUpdateDto {
    return nexusDtoSchema.parse({
      id: row.id,
      name: row.type.name,
      itemCount: row.item_count,
      imageMissingCount: row.image_missing_count,
      changeCount: row.change_count,
      detailMissing: row.detail_missing,
      createdAt: row.created_at,
      insertedAt: row.inserted_at,
      updatedAt: row.updated_at,
    });
  }

  async getAll() {
    const rows = await this.prisma.nexusUpdate.findMany({
      include: {
        type: {
          select: {
            name: true,
          },
        },
      },
    });

    const parsed = rows.map((row) => this.parser(row));

    return parsed;
  }
}
