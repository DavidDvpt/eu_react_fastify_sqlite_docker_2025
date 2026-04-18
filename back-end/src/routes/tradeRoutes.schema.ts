import { z } from 'zod';

const purchaseTradeLineSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().positive(),
  tt: z.number().nonnegative().optional(),
  ttc: z.number().nonnegative(),
});

const purchaseTradeBodySchema = z.object({
  lines: z.array(purchaseTradeLineSchema).min(1),
});

const sellTradeLineSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().positive(),
  inventoryLotId: z.string().min(1).optional(),
  tt: z.number().nonnegative().optional(),
  ttc: z.number().nonnegative(),
});

const sellTradeBodySchema = z.object({
  lines: z.array(sellTradeLineSchema).min(1),
});

export { purchaseTradeBodySchema, sellTradeBodySchema };
