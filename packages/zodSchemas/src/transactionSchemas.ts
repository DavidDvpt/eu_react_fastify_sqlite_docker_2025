import { z } from "zod";
import { genericDateSchema } from "./common.js";
import { lotItemIdSchema } from "./lotSchema.js";
import { transactionTypeSchema } from "./transactionTypeSchema.js";
import { itemDtoSchema } from "./itemSchemas.js";

export const transactionStatusDtoSchema = z.enum([
  "SOLDED",
  "RUNNING",
  "RETURNED",
  "CANCELED",
]);
export const transactionStatusPatchDtoSchema =
  transactionStatusDtoSchema.extract(["SOLDED", "RETURNED", "CANCELED"]);
export const transactionStatusPatchSchema = z.object({
  status: transactionStatusPatchDtoSchema,
});
export const transactionCancelDtoSchema = transactionStatusDtoSchema.extract([
  "CANCELED",
]);

export const transactionLotSchema = z.object({
  lotId: z.string(),
  quantity: z.coerce.number(),
  lot: lotItemIdSchema,
});

export const transactionQuerySchema = z.object({
  itemId: z.string().optional(),
  status: transactionStatusDtoSchema.optional(),
  type: transactionTypeSchema.optional(),
  withItemId: z.coerce.boolean().optional(),
  withLotId: z.coerce.boolean().optional(),
});

export const transactionEntrySchema = z.object({
  itemId: z.string().nullable(),
  lotId: z.string().nullable(),
  quantityLot: z.coerce.number().nullable(),
  transactionType: transactionTypeSchema,
  status: transactionStatusDtoSchema.nullable(),
  tt: z.coerce.number(),
  fee: z.coerce.number().nonnegative(),
  ttc: z.coerce.number(),
});

export const transactionEntriesSchema = transactionEntrySchema.array();

export const transactionValuesSchema = z.object({
  tt: z.coerce.number().nonnegative(),
  ttc: z.coerce.number().positive(),
  fee: z.coerce.number().nonnegative().optional(),
});
export const transactionBodySchema = transactionValuesSchema.extend({
  itemId: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  transactionType: transactionTypeSchema,
  status: transactionStatusDtoSchema,
});

export const transactionSchemaDto = z.object({
  id: z.string(),
  quantity: z.coerce.number().int().positive(),
  tt: z.coerce.number().nonnegative(),
  ttc: z.coerce.number().positive(),
  fee: z.coerce.number().nonnegative().optional(),
  transactionType: transactionTypeSchema,
  status: transactionStatusDtoSchema,
  userId: z.string(),
  ...genericDateSchema.shape,
  entries: transactionLotSchema.array(),
  item: itemDtoSchema.optional(),
});
