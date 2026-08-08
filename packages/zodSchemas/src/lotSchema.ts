import { z } from "zod";
import {
  booleanSchema,
  dateSortKeySchema,
  genericDateSchema,
  sortOrderEnum,
} from "./common.js";

export const lotTypeSchema = z.enum([
  "MINING",
  "CRAFTING",
  "TRADE",
  "REFINING",
]);

export const lotSortSchema = z.enum([
  ...dateSortKeySchema.options,
  "quantityRemaining",
  "lotType",
]);
export const lotBodySchema = z.object({
  id: z.string(),
  quantityRemaining: z.coerce.number(),
  quantityExported: z.coerce.number(),
  priceRemaining: z.coerce.number(),
  itemId: z.string(),
  lotType: lotTypeSchema,
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  isActive: booleanSchema,
});

export const lotItemIdSchema = z.object({ itemId: z.string() });
export const lotDtoSchema = lotItemIdSchema.extend({
  id: z.string(),
  quantityRemaining: z.coerce.number(),
  quantityExported: z.coerce.number(),
  priceRemaining: z.coerce.number(),

  lotType: lotTypeSchema,
  isActive: booleanSchema,
  ...genericDateSchema.shape,
});

export const lotQuerySchema = z.object({
  sortKey: lotSortSchema,
  sortOrder: sortOrderEnum.optional(),
  isActive: booleanSchema,
});
