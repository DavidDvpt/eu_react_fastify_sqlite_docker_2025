import {
  pedcardFormSchema,
  pedcardTypeSchema,
  pedcardDtoSchema,
} from "@eu/zod-schemas";
import { z } from "zod";

export type PedCardFormBody = z.output<typeof pedcardFormSchema>;

export type PedCardTypeDto = z.output<typeof pedcardTypeSchema>;

export type PedcardDto = z.infer<typeof pedcardDtoSchema>;
