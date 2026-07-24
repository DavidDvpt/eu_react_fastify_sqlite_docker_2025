import { z } from "zod";

export const userSignInSchema = z.object({
  pseudo: z.string().min(8, "Le pseudo doit être de 8 caractères minimim"),
  password: z
    .string()
    .min(8, "Le mot de passe doit être de 8 caractères minimim"),
});

export const userSignUpFormSchema = userSignInSchema.extend({
  firstname: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),
  lastname: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),
  email: z.email("Email invalide"),
});
