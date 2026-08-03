import { z } from "zod";
import { booleanSchema, sortOrderEnum, dateSortKeySchema } from "./common.js";

export const itemSortSchema = z.enum([
  ...dateSortKeySchema.options,
  "name",
  "typeId",
]);

export const itemFormSchema = z.object({
  name: z.string().min(1),
  imageUrlId: z.string(),
  value: z.coerce.number().nonnegative(),
  isLimited: z.boolean().optional(),
  typeId: z.string(),
  isActive: booleanSchema.optional(),
});

export const itemQuerySchema = z.object({
  isActive: booleanSchema,
  typeId: z.string(),
  sortKey: itemSortSchema.optional(),
  sortOrder: sortOrderEnum,
});
