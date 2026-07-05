import z from 'zod';

export const pedCardCreateSchema = z.object({
  value: z.number(),
  type: z.string().min(1),
});
