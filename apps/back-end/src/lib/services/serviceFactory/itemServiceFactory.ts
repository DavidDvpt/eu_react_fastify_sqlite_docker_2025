import type { ItemDetailEnum } from '@eu/types';

import prismaClient from '#prisma/prismaClient.js';
import { ItemFinderService } from '#src/lib/services/prisma/itemFinderService.js';
import { ItemService } from '#src/lib/services/prisma/itemService.js';

export function getItemService(details?: ItemDetailEnum) {
  switch (details) {
    case 'finderDetail':
      return new ItemFinderService(prismaClient);
    case 'excavatorDetail':
    case 'refinerDetail':
    default:
      return new ItemService(prismaClient);
  }
}
