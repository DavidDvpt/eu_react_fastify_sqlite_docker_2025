import { z } from "zod";
import {
  booleanSchema,
  sortOrderEnum,
  dateSortKeySchema,
  genericDateSchema,
} from "./common.js";
import { typeDtoSchema } from "./typeSchemas.js";
import { categoryDtoSchema } from "./categorySchemas.js";

export const itemDetailsEnum = z.enum([
  "finderDetail",
  "excavatorDetail",
  "refinerDetail",
]);

export const itemSortSchema = z.enum([...dateSortKeySchema.options, "name"]);

export const itemFormSchema = z.object({
  name: z.string().min(1),
  imageUrlId: z.string(),
  value: z.coerce.number().nonnegative(),
  isLimited: z.boolean().optional(),
  typeId: z.string(),
  isActive: booleanSchema.optional(),
});

export const itemDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  imageUrlId: z.string(),
  value: z.coerce.number(),
  isLimited: booleanSchema,
  typeId: z.string(),
  ...genericDateSchema.shape,
  isActive: booleanSchema,
  userId: z.string(),
  nexusId: z.string().nullable().default(null),
  description: z.string().nullable().default(null),
  weight: z.number().nullable().default(null),
  decay: z.number().nullable().default(null),
  isUntradeable: booleanSchema.nullable().default(null),
  isRare: booleanSchema.nullable().default(null),

  type: typeDtoSchema.optional(),
  category: categoryDtoSchema.optional(),
});

export const itemQuerySchema = z.object({
  isActive: booleanSchema.optional(),
  typeId: z.string().optional(),
  sortKey: itemSortSchema.optional(),
  sortOrder: sortOrderEnum.optional(),
  details: itemDetailsEnum.optional(),
});

export const itemLotsQuerySchema = itemQuerySchema.extend({
  isActive: booleanSchema.optional(),
  typeId: z.string().optional(),
  sortKey: itemSortSchema.optional(),
  sortOrder: sortOrderEnum.optional(),
  hasInitialValue: booleanSchema.optional(),
});
