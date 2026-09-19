import { z } from "zod";
import { SignUpBody } from "@/api/generated/zod/model/signUpBody.zod";

export const userSignUpFormSchema = SignUpBody.extend({
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

export type UserSignupFormBody = z.output<typeof userSignUpFormSchema>;
