import { z } from "zod";

const loginDefaultValues = { pseudo: "", password: "" };
const signUpDefaultValues = {
  pseudo: "",
  firstname: "",
  lastname: "",
  email: "",
};

const signUpDefaultValuesAdmin = {
  ...signUpDefaultValues,
  is_active: true,
};

const loginSchema = z.object({
  pseudo: z.string().min(8, "Le pseudo doit être de 8 caractères minimim"),
  password: z
    .string()
    .min(8, "Le mot de passe doit être de 8 caractères minimim"),
});

const signUpSchema = z.object({
  pseudo: z.string().min(8),
  firstname: z.string().min(8).nullable(),
  lastname: z.string().min(8).nullable(),
  email: z.email(),
});

const signUpSchemaAdmin = signUpSchema.extend({
  isActive: z.boolean(),
});

export {
  loginDefaultValues,
  loginSchema,
  signUpDefaultValues,
  signUpDefaultValuesAdmin,
  signUpSchema,
  signUpSchemaAdmin,
};

export type LoginInput = z.input<typeof loginSchema>;
export type LoginOutput = z.output<typeof loginSchema>;
