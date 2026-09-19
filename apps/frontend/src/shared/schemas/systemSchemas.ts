import { z } from "zod";
import {
  booleanSchema,
  genericDateSchema,
  idSchema,
} from "./common.js";

const systemBaseSchema = idSchema.extend({
  name: z.string().min(1),
  isActive: booleanSchema,
  userId: z.string(),
  ...genericDateSchema.shape,
});

// CATEGORIES
export const categoryDtoSchema = systemBaseSchema;
export type CategoryViewModel = z.infer<typeof categoryDtoSchema>;
export type CategoryViewModels = CategoryViewModel[];

// TYPES
export const typeDtoSchema = systemBaseSchema.extend({
  categoryId: z.string(),
  isStackable: booleanSchema.default(false),
  category: categoryDtoSchema.nullable().default(null),
});
export type TypeViewModel = z.infer<typeof typeDtoSchema>;
export type TypeViewModels = TypeViewModel[];

// ITEMS
export const itemDetailsEnum = z.enum([
  "finderDetail",
  "excavatorDetail",
  "refinerDetail",
]);
export const itemFormSchema = z.object({
  id: z.string().nullable().default(null),
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
export const itemDtoSchema = itemFormSchema.omit({ id: true }).extend({
  id: z.string(),
  userId: z.string(),
  ...genericDateSchema.shape,

  type: typeDtoSchema.nullable().default(null),
});
export type ItemViewModel = z.infer<typeof itemDtoSchema>;
export type ItemViewModels = ItemViewModel[];
export type ItemDetailEnum = z.infer<typeof itemDetailsEnum>;

export const finderDtoSchema = itemDtoSchema.extend({
  depth: z.number().nullable().default(null),
  usePerMinute: z.number().nullable().default(null),
  nexusUrl: z.string().nullable().default(null),
  ammoBurn: z.number().nullable().default(null),
});

export type Finder = z.infer<typeof finderDtoSchema>;
