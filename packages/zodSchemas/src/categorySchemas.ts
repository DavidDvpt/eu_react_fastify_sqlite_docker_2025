import { z } from "zod";
import { booleanSchema } from "./common.js";

export const categoryFormSchema = z.object({
  name: z.string().min(1),
  is_active: booleanSchema.optional(),
});

export const categoryQuerySchema = z.object({
  isActive: booleanSchema.optional(),
});
