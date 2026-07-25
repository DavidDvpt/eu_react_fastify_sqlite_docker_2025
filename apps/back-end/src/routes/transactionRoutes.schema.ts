import { z } from 'zod';

export const patchTransactionParamsSchema = z.object({
  id: z.string(),
});

export const patchTransactionBodySchema = z.object({
  status: z.enum(['SOLDED', 'RETURNED']),
});

export const transactionBodySchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().positive(),
  inventoryLotId: z.string().min(1).optional(),
  tt: z.number().nonnegative(),
  ttc: z.number().nonnegative(),
  fee: z.number().nonnegative().optional().default(0),
  transactionType: z.enum(['BUY', 'SELL']),
  status: z.enum(['SOLDED', 'RETURNED', 'RUNNING']),
});
