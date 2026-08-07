import {
  userSignUpFormSchema,
  userSignInFormSchema,
  userRoleSchema,
  userSchemaDto,
} from "@eu/zod-schemas";
import { z } from "zod";

export type UserRole = z.infer<typeof userRoleSchema>;

export type UserSignUpFormOutputBody = z.output<typeof userSignUpFormSchema>;

export type UserSignInFormOutputBody = z.output<typeof userSignInFormSchema>;

export type UserDto = z.infer<typeof userSchemaDto>;
