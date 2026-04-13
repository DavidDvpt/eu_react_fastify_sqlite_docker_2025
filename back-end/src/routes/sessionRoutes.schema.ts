import { z } from 'zod';

export const sellSessionsQuerySchema = z.object({
  status: z.enum(['RUNNING', 'SOLDED', 'RETURNED']).optional(),
});

