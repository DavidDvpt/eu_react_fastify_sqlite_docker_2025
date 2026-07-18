import { z } from 'zod';

export const signinBodySchema = z
  .object({
    pseudo: z.string().min(4),
    password: z.string().min(8),
  })
  .strict();

export type SigninBody = z.infer<typeof signinBodySchema>;
