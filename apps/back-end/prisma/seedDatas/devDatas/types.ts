import type { Prisma } from '#prisma/generated/client.js';

export type TransactionSeedType = Omit<
  Prisma.TransactionCreateManyInput,
  'user_id' | 'created_at' | 'updated_at'
>;
