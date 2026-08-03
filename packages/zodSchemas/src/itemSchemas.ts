import { z } from "zod";
import { booleanSchema, sortOrderEnum, nameSortSchema } from "./common.js";

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
  sortKey: nameSortSchema.keyof(),
  sortOrder: sortOrderEnum,
});
