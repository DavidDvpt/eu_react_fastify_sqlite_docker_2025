import { z } from "zod";
import { genericDateSchema, idSchema } from "./common.js";
import { lotItemIdSchema } from "./lotSchema.js";
import { transactionTypeSchema } from "./transactionTypeSchema.js";
import { itemDtoSchema } from "./systemSchemas.js";

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
export const transactionValuesSchema = z.object({
  tt: z.coerce.number().nonnegative(),
  ttc: z.coerce.number().positive(),
  fee: z.coerce.number().nonnegative(),
});
export const transactionLotSchema = z.object({
  lotId: z.string(),
  quantity: z.coerce.number(),
  lot: lotItemIdSchema.nullable().default(null),
});

export const transactionQuerySchema = z.object({
  itemId: z.string().optional(),
  status: transactionStatusDtoSchema.optional(),
  type: transactionTypeSchema.optional(),
  withItemId: z.coerce.boolean().optional(),
  withLotId: z.coerce.boolean().optional(),
});

export const transactionEntrySchema = transactionValuesSchema.extend({
  itemId: z.string().nullable(),
  lotId: z.string().nullable(),
  quantityLot: z.coerce.number().nullable(),
  transactionType: transactionTypeSchema,
  status: transactionStatusDtoSchema.nullable(),
});

export const transactionEntriesSchema = transactionEntrySchema.array();

export const transactionBodySchema = transactionValuesSchema.extend({
  itemId: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  transactionType: transactionTypeSchema,
  status: transactionStatusDtoSchema,
});

export const transactionDtoSchema = transactionValuesSchema.extend({
  ...idSchema.shape,
  itemId: z.string(),
  quantity: z.coerce.number().int().positive(),
  transactionType: transactionTypeSchema,
  status: transactionStatusDtoSchema,
  entries: transactionLotSchema.array().nullable().default(null),
  item: itemDtoSchema.nullable().default(null),
  ...genericDateSchema.shape,
});

export type TransactionDto = z.infer<typeof transactionDtoSchema>;
export type TransactionDtos = TransactionDto[];
