import { z } from "zod";

const loginDefaultValues = { pseudo: "", password: "" };
const signUpDefaultValues = {
  pseudo: "",
  firstname: "",
  lastname: "",
  email: "",
  password: "",
};

const loginSchema = z.object({
  pseudo: z.string().min(8, "Le pseudo doit être de 8 caractères minimim"),
  password: z
    .string()
    .min(8, "Le mot de passe doit être de 8 caractères minimim"),
});

const signUpSchema = z.object({
  pseudo: z.string().min(4, "Le pseudo doit contenir au moins 4 caracteres"),
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
  password: z
    .string()
    .min(8, "Le mot de passe doit etre de 8 caracteres minimum"),
});

export {
  loginDefaultValues,
  loginSchema,
  signUpDefaultValues,
  signUpSchema,
};

export type LoginInput = z.input<typeof loginSchema>;
export type LoginOutput = z.output<typeof loginSchema>;
export type SignUpInput = z.input<typeof signUpSchema>;
export type SignUpOutput = z.output<typeof signUpSchema>;
