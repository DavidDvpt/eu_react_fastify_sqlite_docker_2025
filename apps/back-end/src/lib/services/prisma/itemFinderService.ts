import type { Prisma } from '#prisma/generated/client.js';
import type { RootDatabaseClient } from '#prisma/prismaClient.js';
import type { Finder } from '@eu/types';

import { ItemService } from '#src/lib/services/prisma/itemService.js';

type ItemWithFinderDetail = Prisma.ItemGetPayload<{
  include: { finderDetail: true };
}>;
export class ItemFinderService extends ItemService {
  constructor(protected readonly prisma: RootDatabaseClient) {
    super(prisma);
  }

  parsedToDto(row: ItemWithFinderDetail): Finder | null {
    const base = super.parsedToDto(row);
    if (!base) return null;

    const parsed: Finder = {
      ...base,
      depth: row.finderDetail?.depth ? Number(row.finderDetail?.depth) : null,
      ammoBurn: row.finderDetail?.ammo_burn ? Number(row.finderDetail?.ammo_burn) : null,
      nexusUrl: row.finderDetail?.nexus_url ?? null,
      usePerMinute: row.finderDetail?.use_per_minute ? Number(row.finderDetail?.ammo_burn) : null,
    };

    return parsed;
  }
}
