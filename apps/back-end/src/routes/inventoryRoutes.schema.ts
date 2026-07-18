import { z } from 'zod';

export const stockByItemParamsSchema = z.object({
  id: z.string().min(1),
});

export const stockByItemQuerySchema = z.object({
  include: z.enum(['details']).optional(),
});
