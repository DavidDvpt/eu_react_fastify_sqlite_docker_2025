import { nexusDtoSchema } from '@eu/zod-schemas';

import type { NexusUpdate } from '#prisma/generated/client.js';
import type { DatabaseClient } from '#prisma/prismaClient.js';
import type { NexusUpdateWithTypeName } from '#src/types/prismaApi/nexus.js';
import type { NexusFormBody, NexusUpdateDto } from '@eu/types';

export class NexusService {
  constructor(private readonly prisma: DatabaseClient) {}

  private parserToPrisma(value: NexusUpdateDto): NexusUpdate {
    return {
      id: value.id,
      nexus_request_type: value.nexusRequestType,
      nexus_name: value.nexusName ?? value.name,
      item_count: value.itemCount,
      image_missing_count: value.imageMissingCount,
      change_count: value.changeCount,
      created_at: value.createdAt,
      inserted_at: value.insertedAt,
      updated_at: value.updatedAt,
    };
  }

  private parserToDto(row: NexusUpdateWithTypeName): NexusUpdateDto {
    return nexusDtoSchema.parse({
      id: row.id,
      name: row.type.name,
      nexusRequestType: row.nexus_request_type,
      nexusName: row.nexus_name ?? row.type.name,
      itemCount: row.item_count,
      imageMissingCount: row.image_missing_count,
      changeCount: row.change_count,
      createdAt: row.created_at,
      insertedAt: row.inserted_at,
      updatedAt: row.updated_at,
    });
  }

  async count() {
    const result = await this.prisma.nexusUpdate.aggregate({ _count: true });

    return { count: result._count };
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

    const parsed = rows.map((row) => this.parserToDto(row));

    return parsed;
  }

  async createMany({ values }: { values: NexusUpdateDto[] }) {
    const data = values.map((value) => this.parserToPrisma(value));

    return this.prisma.nexusUpdate.createMany({ data });
  }

  async update({ id, body }: { id: string; body: NexusFormBody }) {
    const updated = await this.prisma.nexusUpdate.update({
      where: { id },
      data: {
        nexus_name: body.nexusName,
        nexus_request_type: body.nexusRequestType,
        updated_at: new Date().toISOString(),
        type: {
          update: {
            name: body.name,
          },
        },
      },
      include: {
        type: {
          select: {
            name: true,
          },
        },
      },
    });

    return this.parserToDto(updated);
  }
}
