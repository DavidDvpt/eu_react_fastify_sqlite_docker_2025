import { z } from "zod";
import {
  booleanSchema,
  dateSortKeySchema,
  genericDateSchema,
  sortOrderEnum,
} from "./common.js";

export const categorySortKey = z.enum([...dateSortKeySchema.options, "name"]);

export const categoryFormSchema = z.object({
  name: z.string().min(1),
  isActive: booleanSchema,
});

export const categoryDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  isActive: booleanSchema,
  userId: z.string(),
  ...genericDateSchema.shape,
});

export const categoryQuerySchema = z.object({
  isActive: booleanSchema.optional(),
  sortKey: categorySortKey.optional(),
  sortOrder: sortOrderEnum.optional(),
});
