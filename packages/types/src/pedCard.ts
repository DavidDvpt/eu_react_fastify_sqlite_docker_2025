import { pedcardFormSchema } from "@eu/zod-schemas";
import { z } from "zod";

export type PedCardFormBody = z.infer<typeof pedcardFormSchema>;
