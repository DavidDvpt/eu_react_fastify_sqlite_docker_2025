import { z } from "zod";
import {
  booleanSchema,
  sortOrderEnum,
  dateSortKeySchema,
  genericDateSchema,
} from "./common.js";
import { typeDtoSchema } from "./typeSchemas.js";
import { categoryDtoSchema } from "./categorySchemas.js";

export const itemSortKeysSchema = z.enum([
  ...dateSortKeySchema.options,
  "name",
]);

export const itemDetailsEnum = z.enum([
  "finderDetail",
  "excavatorDetail",
  "refinerDetail",
]);

export const itemFormSchema = z.object({
  name: z.string().min(1),
  typeId: z.string(),
  imageUrlId: z.string().nullable().default(null),
  value: z.coerce.number().nonnegative(),
  nexusId: z.number().nullable().default(null),
  description: z.string().nullable().default(null),
  weight: z.number().nullable().default(null),
  decay: z.number().nullable().default(null),
  isLimited: booleanSchema.nullable().default(null),
  isActive: booleanSchema.optional().default(true),
  isUntradeable: booleanSchema.nullable().default(null),
  isRare: booleanSchema.nullable().default(null),
});
export const itemFormWithIdSchema = itemFormSchema.extend({ id: z.string() });

export const itemDtoSchema = itemFormWithIdSchema.extend({
  userId: z.string(),
  ...genericDateSchema.shape,

  type: typeDtoSchema.nullable().default(null),
  category: categoryDtoSchema.nullable().default(null),
});

export const itemQuerySchema = z.object({
  isActive: booleanSchema.optional(),
  typeId: z.string().optional(),
  sortKey: itemSortKeysSchema.optional(),
  sortOrder: sortOrderEnum.optional(),
  details: itemDetailsEnum.optional(),
});
