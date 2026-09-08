import { z } from "zod";
import { genericDateSchema, idSchema } from "./common.js";
import { lotItemIdSchema } from "./lotSchema.js";
import { itemDtoSchema } from "./systemSchemas.js";

export const transactionTypeSchema = z.enum([
  "BUY",
  "SELL",
  "FOUND",
  "GIFT",
  "EXISTING_STOCK",
  "SELL",
  "GIVEN",
]);
export type TransactionTypeDto = z.output<typeof transactionTypeSchema>;

export const transactionStatusDtoSchema = z.enum([
  "SOLDED",
  "RUNNING",
  "RETURNED",
  "CANCELED",
]);
export type TransactionStatusDto = z.output<typeof transactionStatusDtoSchema>;

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

export type TransactionStatusPatchDto = z.infer<
  typeof transactionStatusPatchDtoSchema
>;
export type TransactionCancelDto = z.infer<typeof transactionCancelDtoSchema>;

export type TransactionQuery = z.infer<typeof transactionQuerySchema>;

export type TransactionEntry = z.infer<typeof transactionEntrySchema>;
export type TransactionEntries = z.infer<typeof transactionEntriesSchema>;
// export type TransactionDto = z.infer<typeof transactionDtoSchema>;
export type TransactionValues = z.infer<typeof transactionValuesSchema>;

export type TransactionBodyDto = z.infer<typeof transactionBodySchema>;
