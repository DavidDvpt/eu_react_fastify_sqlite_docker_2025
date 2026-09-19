import { z } from "zod";
import { SignUpBody } from "@/api/generated/zod/model/signUpBody.zod";
import { booleanSchema, genericDateSchema } from "./common.js";

export const userRoleSchema = z.enum(["ADMIN", "USER"]);

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

export const userSchemaDto = userSignUpFormSchema.extend({
  id: z.string(),
  role: userRoleSchema,
  isActive: booleanSchema,
  ...genericDateSchema.shape,
});

export type UserRole = z.infer<typeof userRoleSchema>;

export type UserSignupFormBody = z.output<typeof userSignUpFormSchema>;

export type UserDto = z.infer<typeof userSchemaDto>;
