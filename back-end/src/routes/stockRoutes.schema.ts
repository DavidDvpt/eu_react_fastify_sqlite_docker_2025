import { z } from 'zod';

export const stockByItemParamsSchema = z.object({
  id: z.string().min(1),
});

export const stockByItemQuerySchema = z.object({
  include: z.enum(['details']).optional(),
});

const transactionLineBaseSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().positive(),
  inventoryLotId: z.string().min(1).optional(),
});

const inventoryBuyTransactionLineSchema = transactionLineBaseSchema.extend({
  tt: z.number().nonnegative(),
  ttc: z.number().nonnegative(),
  fee: z.number().nonnegative().optional(),
});

const inventorySellTransactionLineSchema = transactionLineBaseSchema.extend({
  tt: z.number().nonnegative(),
  ttc: z.number().nonnegative(),
  fee: z.number().nonnegative(),
});

export const inventoryTransactionBodySchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('buy'),
    lines: z.array(inventoryBuyTransactionLineSchema).min(1),
  }),
  z.object({
    type: z.literal('sell'),
    lines: z.array(inventorySellTransactionLineSchema).min(1),
  }),
]);
