import { z } from "zod";
import { optionalBooleanHttpSchema } from "./common.js";

export const categoryFormSchema = z.object({
  name: z.string().min(1),
  is_active: optionalBooleanHttpSchema,
});

export const categoryQuerySchema = z.object({
  isActive: optionalBooleanHttpSchema,
});
