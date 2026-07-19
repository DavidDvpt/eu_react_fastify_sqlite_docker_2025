import { z } from "zod";

export const pedcardFormSchema = z.object({
  userId: z.string(),
  transactionId: z.string().optional(),
  type: z.string(),
  value: z.number(),
});
