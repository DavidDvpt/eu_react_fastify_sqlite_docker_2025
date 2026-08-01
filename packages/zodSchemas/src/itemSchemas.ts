import { z } from "zod";
import { sortOrderEnum } from "./common.js";

export const itemFormSchema = z.object({
  name: z.string().min(1),
  imageUrlId: z.string(),
  value: z.coerce.number().nonnegative(),
  isLimited: z.boolean().optional(),
  typeId: z.string(),
  isActive: z.boolean().optional(),
});

export const itemQuerySchema = z.object({
  isActive: z.boolean().optional(),
  typeId: z.string().optional(),
  sortKey: z.string().optional(),
  sortOrder: sortOrderEnum.optional(),
});
