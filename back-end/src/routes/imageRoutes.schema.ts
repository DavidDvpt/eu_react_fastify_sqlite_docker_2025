import { z } from 'zod';

export const imageIdParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Invalid image id'),
});

export const imageQuerySchema = z.object({
  size: z.enum(['micro', 'normal']).default('normal'),
});
