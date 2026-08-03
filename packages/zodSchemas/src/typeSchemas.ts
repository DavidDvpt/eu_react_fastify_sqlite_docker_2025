import { z } from "zod";
import { booleanSchema, dateSortKeySchema, sortOrderEnum } from "./common.js";

export const typeSortSchema = z.enum([...dateSortKeySchema.options, "name"]);

export const typeFormSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string(),
  isActive: booleanSchema,
  isStackable: booleanSchema,
});

export const typeDtoSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  categoryId: z.string(),
  isActive: booleanSchema,
  isStackable: booleanSchema,
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  userId: z.string(),
});

export const typeQuerySchema = z.object({
  isActive: booleanSchema.optional(),
  categoryId: z.string().optional(),
  sortKey: typeSortSchema.optional(),
  sortOrder: sortOrderEnum.optional(),
});
