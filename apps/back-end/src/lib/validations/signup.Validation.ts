import { z } from 'zod';

export const signupBodySchema = z
  .object({
    pseudo: z.string().min(4),
    email: z.email(),
    password: z.string().min(8),
    firstname: z.string().min(1).optional(),
    lastname: z.string().min(1).optional(),
  })
  .strict();

export type SignupBody = z.infer<typeof signupBodySchema>;
