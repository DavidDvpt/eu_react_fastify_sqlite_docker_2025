import { z } from "zod";
import {
  optionalBooleanHttpSchema,
  optionalSortOrderHttpSchema,
  systemSortSchema,
} from "./common.js";

export const typeFormSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string(),
  isActive: optionalBooleanHttpSchema,
  isStackable: z.boolean().optional(),
});

export const typeQuerySchema = z.object({
  isActive: optionalBooleanHttpSchema,
  categoryId: z.string().optional(),
  sortKey: systemSortSchema.keyof().optional(),
  sortOrder: optionalSortOrderHttpSchema,
});
