import { z } from 'zod';

export const transactionSellQuerySchema = z.object({
  status: z.enum(['RUNNING', 'SOLDED', 'RETURNED']).optional(),
});

export const updateTransactionLineStatusParamsSchema = z.object({
  id: z.string().uuid(),
});

export const updateTransactionLineStatusBodySchema = z.object({
  status: z.enum(['SOLDED', 'RETURNED']),
});
