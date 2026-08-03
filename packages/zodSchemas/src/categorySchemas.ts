import { z } from "zod";
import { booleanSchema, dateSortKeySchema } from "./common.js";

export const categorySortKey = z.enum([...dateSortKeySchema.options, "name"]);

export const categoryFormSchema = z.object({
  name: z.string().min(1),
  is_active: booleanSchema.optional(),
});

export const categoryQuerySchema = z.object({
  isActive: booleanSchema.optional(),
});
