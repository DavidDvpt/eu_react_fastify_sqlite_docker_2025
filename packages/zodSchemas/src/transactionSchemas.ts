import { z } from "zod";
import { genericDateSchema } from "./common.js";

export const transactionTypeSchema = z.enum([
  "BUY",
  "SELL",
  "FOUND",
  "GIFT",
  "EXISTING_STOCK",
  "SELL",
  "GIVEN",
]);
export const transactionStatusDtoSchema = z.enum([
  "SOLDED",
  "RUNNING",
  "RETURNED",
  "CANCELED",
]);
export const transactionStatusPatchDtoSchema =
  transactionStatusDtoSchema.extract(["SOLDED", "RETURNED"]);
export const transactionCancelDtoSchema = transactionStatusDtoSchema.extract([
  "CANCELED",
]);

export const transactionLotSchema = z.object({
  lotId: z.string(),
  quantity: z.coerce.number(),
});

export const transactionQuerySchema = z.object({
  itemId: z.string().optional(),
  status: transactionStatusPatchDtoSchema.optional(),
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

export const transactionSchemaDto = transactionBodySchema.extend({
  id: z.string(),
  userId: z.string(),
  ...genericDateSchema.shape,
  entries: transactionLotSchema.array(),
});
