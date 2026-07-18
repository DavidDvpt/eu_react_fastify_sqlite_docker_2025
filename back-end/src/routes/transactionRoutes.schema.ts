import { z } from 'zod';

const transactionLineBaseSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().positive(),
  inventoryLotId: z.string().min(1).optional(),
});

const transactionBuyLineSchema = transactionLineBaseSchema.extend({
  tt: z.number().nonnegative(),
  ttc: z.number().nonnegative(),
  fee: z.number().nonnegative().optional(),
});

const transactionSellLineSchema = transactionLineBaseSchema.extend({
  tt: z.number().nonnegative(),
  ttc: z.number().nonnegative(),
  fee: z.number().nonnegative(),
});

export const updateTransactionLineStatusParamsSchema = z.object({
  id: z.string().uuid(),
});

export const updateTransactionLineStatusBodySchema = z.object({
  status: z.enum(['SOLDED', 'RETURNED']),
});

export const transactionBodySchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('buy'),
    lines: z.array(transactionBuyLineSchema).min(1),
  }),
  z.object({
    type: z.literal('sell'),
    lines: z.array(transactionSellLineSchema).min(1),
  }),
]);
