import { z } from "zod";
import { booleanSchema, dateSortKeySchema, sortOrderEnum } from "./common.js";

export const categorySortKey = z.enum([...dateSortKeySchema.options, "name"]);

export const categoryFormSchema = z.object({
  name: z.string().min(1),
  isActive: booleanSchema,
});

export const categoryDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  isActive: booleanSchema,
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  userId: z.string(),
});

export const categoryQuerySchema = z.object({
  isActive: booleanSchema.optional(),
  sortKey: categorySortKey.optional(),
  sortOrder: sortOrderEnum.optional(),
});
