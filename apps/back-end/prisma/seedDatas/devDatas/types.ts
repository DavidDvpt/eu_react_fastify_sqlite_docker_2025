import type { Prisma } from '#prisma/generated/client.js';

export type TransactionSeedType = Omit<
  Prisma.TransactionCreateManyInput,
  'user_id' | 'date_created' | 'date_updated' | 'is_active'
>;
