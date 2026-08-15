import {
  pedcardFormSchema,
  pedcardTypeSchema,
  pedcardDtoSchema,
  pedcardBalanceSchema,
  pedcardCanPaySchema,
  pedcardCheckSchema,
} from "@eu/zod-schemas";
import { z } from "zod";

export type PedCardFormBody = z.output<typeof pedcardFormSchema>;

export type PedCardTypeDto = z.output<typeof pedcardTypeSchema>;

export type PedcardDto = z.infer<typeof pedcardDtoSchema>;

export type PedcardCheck = z.infer<typeof pedcardCheckSchema>;
export type PedcardCanPay = z.infer<typeof pedcardCanPaySchema>;
export type PedcardBalance = z.infer<typeof pedcardBalanceSchema>;
