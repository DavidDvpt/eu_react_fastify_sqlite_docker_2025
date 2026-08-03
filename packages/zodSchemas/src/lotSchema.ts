import { z } from "zod";
import { booleanSchema, dateSortSchema, sortOrderEnum } from "./common.js";

export const lotTypeSchema = z.enum([
  "MINING",
  "CRAFTING",
  "TRADE",
  "REFINING",
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

export const lotSortSchema = z.enum([
  ...dateSortSchema.options,
  "quantityRemaining",
  "lotType",
]);

export const lotQuerySchema = z.object({
  itemId: z.string(),
  sortKey: lotSortSchema,
  sortOrder: sortOrderEnum.optional(),
  isActive: booleanSchema,
});
