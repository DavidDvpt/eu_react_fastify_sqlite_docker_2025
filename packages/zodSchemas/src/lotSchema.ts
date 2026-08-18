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
const lotTransactionTypeSchema = z.enum([
  "BUY",
  "SELL",
  "FOUND",
  "GIFT",
  "EXISTING_STOCK",
  "GIVEN",
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
export const lotTransactionSchema = z.object({
  transactionId: z.string(),
  quantity: z.coerce.number(),
});

export const lotDtoSchema = lotItemIdSchema.extend({
  id: z.string(),
  initialQuantity: z.coerce.number(),
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
  type: lotTransactionTypeSchema.optional(),
  hasInitialValue: booleanSchema.optional(),
});
