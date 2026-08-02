import { z } from "zod";
import {
  optionalBooleanHttpSchema,
  optionalSortOrderHttpSchema,
  systemSortSchema,
} from "./common.js";

export const itemFormSchema = z.object({
  name: z.string().min(1),
  imageUrlId: z.string(),
  value: z.coerce.number().nonnegative(),
  isLimited: z.boolean().optional(),
  typeId: z.string(),
  isActive: optionalBooleanHttpSchema,
});

export const itemQuerySchema = z.object({
  isActive: optionalBooleanHttpSchema,
  typeId: z.string().optional(),
  sortKey: systemSortSchema.keyof().optional(),
  sortOrder: optionalSortOrderHttpSchema,
});
