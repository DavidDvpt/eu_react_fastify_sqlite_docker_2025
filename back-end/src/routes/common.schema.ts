import z from 'zod';

export const requestUserSchema = z.object({
  id: z.string().min(1),
});
