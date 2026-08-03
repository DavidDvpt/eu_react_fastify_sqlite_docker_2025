import { z } from "zod";
import { typeDtoSchema, typeFormSchema, typeSortSchema } from "@eu/zod-schemas";

export type TypeFormBody = z.output<typeof typeFormSchema>;

export type TypeSortKey = z.infer<typeof typeSortSchema>;

export type TypeDto = z.infer<typeof typeDtoSchema>;
