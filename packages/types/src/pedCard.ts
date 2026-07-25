import { pedcardFormSchema, pedCardTypeSchema } from "@eu/zod-schemas";
import { z } from "zod";
import type { UserDto } from "./user.js";

export type PedCardFormInputBody = z.input<typeof pedcardFormSchema>;
export type PedCardFormOutputBody = z.output<typeof pedcardFormSchema>;

export type PedCardTypeDto = z.output<typeof pedCardTypeSchema>;

export type PedcardDto = {
  id: string;
  userId: string;
  transactionId: string;
  type: PedCardTypeDto;
  value: number;
  created_at: string;

  user?: UserDto;
  transaction?: any;
};
