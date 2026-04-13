import { z } from 'zod';

export const stockByItemParamsSchema = z.object({
  id: z.string().min(1),
});
