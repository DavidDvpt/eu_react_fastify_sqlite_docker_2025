import { z } from "zod";
import { typeFormSchema } from "@eu/zod-schemas";

export type TypeFormIntputBody = z.input<typeof typeFormSchema>;
export type TypeFormOutputBody = z.output<typeof typeFormSchema>;
