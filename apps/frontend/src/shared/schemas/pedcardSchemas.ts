import { z } from "zod";
import { PedcardType } from "@/api/generated/zod/model/pedcardType.zod";

export const pedcardTypeSchema = PedcardType;

export const pedcardDtoSchema = z.object({
  id: z.string(),
  userId: z.string(),
  transactionId: z.string().nullable(),
  type: pedcardTypeSchema,
  value: z.coerce.number(),
  createdat: z.string(),
});

export const pedcardBalanceSchema = z.object({ balance: z.number() });

export type PedcardTypeDto = z.output<typeof pedcardTypeSchema>;
export type PedcardViewModel = z.infer<typeof pedcardDtoSchema>;
export type PedcardBalance = z.infer<typeof pedcardBalanceSchema>;
