import { userSignUpFormSchema, userSignInSchema } from "@eu/zod-schemas";
import { z } from "zod";

export type UserRole = "ADMIN" | "USER";

export type UserSignUpFormIntputBody = z.input<typeof userSignUpFormSchema>;
export type UserSignUpFormOutputBody = z.output<typeof userSignUpFormSchema>;

export type UserSignInFormIntputBody = z.input<typeof userSignInSchema>;
export type UserSignInFormOutputBody = z.output<typeof userSignInSchema>;

export type UserDto = {
  id: string;
  pseudo: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  firstname?: string;
  lastname?: string;
  createdAt?: string;
  updatedAt?: string;
  password?: string;
};
