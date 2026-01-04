import { z } from "zod";

const loginDefaultValues = { pseudo: "", password: "" };

const loginSchema = z.object({
  pseudo: z.string().min(8),
  password: z.string().min(8),
});

export { loginDefaultValues, loginSchema };

export type LoginInput = z.input<typeof loginSchema>;
export type LoginOutput = z.output<typeof loginSchema>;
