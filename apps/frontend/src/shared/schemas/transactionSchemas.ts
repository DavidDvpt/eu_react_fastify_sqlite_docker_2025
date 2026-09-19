import { z } from "zod";
import { TransactionStatus } from "@/api/generated/zod/model/transactionStatus.zod";
import { TransactionType } from "@/api/generated/zod/model/transactionType.zod";
import { genericDateSchema, idSchema } from "./common.js";
import { lotItemIdSchema } from "./lotSchema.js";
import { itemViewModelSchema } from "./systemSchemas.js";

export const transactionTypeSchema = TransactionType;
export type TransactionTypeDto = z.output<typeof transactionTypeSchema>;

export const transactionStatusDtoSchema = TransactionStatus;
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

export const transactionEntrySchema = transactionValuesSchema.extend({
  itemId: z.string().nullable(),
  lotId: z.string().nullable(),
  quantityLot: z.coerce.number().nullable(),
  transactionType: transactionTypeSchema,
  status: transactionStatusDtoSchema.nullable(),
});

export const transactionEntriesSchema = transactionEntrySchema.array();

export const transactionViewModelSchema = transactionValuesSchema.extend({
  ...idSchema.shape,
  itemId: z.string(),
  quantity: z.coerce.number().int().positive(),
  transactionType: transactionTypeSchema,
  status: transactionStatusDtoSchema,
  entries: transactionLotSchema.array().nullable().default(null),
  item: itemViewModelSchema.nullable().default(null),
  ...genericDateSchema.shape,
});

export type TransactionViewModel = z.infer<typeof transactionViewModelSchema>;
export type TransactionViewModels = TransactionViewModel[];

export type TransactionStatusPatchDto = z.infer<
  typeof transactionStatusPatchDtoSchema
>;
export type TransactionCancelDto = z.infer<typeof transactionCancelDtoSchema>;

export type TransactionEntry = z.infer<typeof transactionEntrySchema>;
export type TransactionEntries = z.infer<typeof transactionEntriesSchema>;
// export type TransactionViewModel = z.infer<typeof transactionViewModelSchema>;
export type TransactionValues = z.infer<typeof transactionValuesSchema>;
