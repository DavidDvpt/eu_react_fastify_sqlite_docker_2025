import { z } from 'zod';

export const sellSessionsQuerySchema = z.object({
  status: z.enum(['RUNNING', 'SOLDED', 'RETURNED']).optional(),
});

export const updateSellLineStatusParamsSchema = z.object({
  id: z.string().uuid(),
});

export const updateSellLineStatusBodySchema = z.object({
  status: z.enum(['SOLDED', 'RETURNED']),
});
