import { pedcardFormSchema } from "@eu/zod-schemas";
import { z } from "zod";

export type PedCardFormInputBody = z.input<typeof pedcardFormSchema>;
export type PedCardFormOutputBody = z.output<typeof pedcardFormSchema>;
