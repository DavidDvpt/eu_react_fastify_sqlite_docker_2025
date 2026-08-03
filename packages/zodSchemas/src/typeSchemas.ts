import { z } from "zod";
import { booleanSchema, sortOrderEnum, nameSortSchema } from "./common.js";

export const typeFormSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string(),
  isActive: booleanSchema.optional(),
  isStackable: booleanSchema.optional(),
});

export const typeQuerySchema = z.object({
  isActive: booleanSchema.optional(),
  categoryId: z.string().optional(),
  sortKey: nameSortSchema.keyof().optional(),
  sortOrder: sortOrderEnum.optional(),
});
