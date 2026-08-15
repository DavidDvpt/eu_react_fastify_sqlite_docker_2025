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
});

export const transactionBodySchema = z.object({
  itemId: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  tt: z.coerce.number().nonnegative(),
  ttc: z.coerce.number().positive(),
  fee: z.coerce.number().nonnegative().optional(),
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
