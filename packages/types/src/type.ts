import z from "zod";
import { typeFormSchema } from "@eu/zod-schemas";

export type TypeFormBody = z.infer<typeof typeFormSchema>;
