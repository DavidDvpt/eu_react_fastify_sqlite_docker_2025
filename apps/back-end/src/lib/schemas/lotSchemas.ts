import type { Prisma } from '#prisma/generated/client.js';
import type { LotSortKey } from '@eu/types';

export const prismaLotSortKey = {
  createdAt: 'date_created',
  updatedAt: 'date_updated',
  quantityRemaining: 'quantity_remaining',
  lotType: 'lot_type',
} as const satisfies Record<LotSortKey, keyof Prisma.LotOrderByWithRelationInput>;
