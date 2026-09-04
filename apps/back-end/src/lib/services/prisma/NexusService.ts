import { nexusDtoSchema, nexusRequestTypeSchema } from '@eu/zod-schemas';

import type { NexusUpdate } from '#prisma/generated/client.js';
import type { DatabaseClient } from '#prisma/prismaClient.js';
import type { NexusUpdateWithAppType } from '#src/types/prismaApi/nexus.js';
import type { NexusFormBody, NexusUpdateDto, NexusRequestTypeEnum } from '@eu/types';

import { ItemService } from '#src/lib/services/prisma/itemService.js';
import { TypeService } from '#src/lib/services/prisma/typeService.js';
import { nexusCountsSchema, type NexusCounts } from '#src/lib/zodSchemas/nexusSchemas.js';

export class NexusService {
  constructor(private readonly prisma: DatabaseClient) {}

  private parserToPrisma(value: NexusUpdateDto): NexusUpdate {
    return {
      id: value.id,
      nexus_request_type: value.nexusRequestType,
      nexus_name: value.nexusName ?? value.appTypeName,
      item_count: value.itemCount,
      image_missing_count: value.imageMissingCount,
      change_count: value.changeCount,
      created_at: value.createdAt,
      inserted_at: value.insertedAt,
      updated_at: value.updatedAt,
    };
  }

  private parserToDto(row: NexusUpdateWithAppType): NexusUpdateDto {
    return nexusDtoSchema.parse({
      id: row.id,
      appTypeName: row.type.name,
      appTypeId: row.type.id,
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

  async getCounts(): Promise<NexusCounts> {
    const ts = new TypeService(this.prisma);
    const is = new ItemService(this.prisma);

    const [types, itemCountByType, itemWithoutImageCountByType] = await Promise.all([
      ts.getAll(),
      is.groupByType(),
      is.groupByType({ noImage: true }),
    ]);

    return nexusCountsSchema.parse(
      Object.fromEntries(
        types.map((type) => [
          type.name,
          {
            itemCount: itemCountByType?.[type.id] ?? 0,
            itemCountWithoutImage: itemWithoutImageCountByType?.[type.id] ?? 0,
          },
        ])
      )
    );
  }

  async getAll({ requestType }: { requestType?: NexusRequestTypeEnum } = {}) {
    const veryfiedType = nexusRequestTypeSchema.optional().parse(requestType);

    const rows = await this.prisma.nexusUpdate.findMany({
      where: { nexus_request_type: veryfiedType },
      include: {
        type: {
          select: {
            name: true,
            id: true,
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

  async update({
    id,
    body,
    counts,
  }: {
    id: string;
    body: NexusFormBody;
    counts?: NexusCounts[string];
  }) {
    const updated = await this.prisma.nexusUpdate.update({
      where: { id },
      data: {
        nexus_name: body.nexusName,
        nexus_request_type: body.nexusRequestType,
        item_count: counts?.itemCount,
        image_missing_count: counts?.itemCountWithoutImage,
        updated_at: new Date().toISOString(),
        type: {
          update: {
            name: body.appTypeName,
          },
        },
      },
      include: {
        type: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    return this.parserToDto(updated);
  }
}
