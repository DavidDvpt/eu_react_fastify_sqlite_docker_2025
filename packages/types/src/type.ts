import { z } from "zod";
import {
  typeDtoSchema,
  typeFormSchema,
  typeQuerySchema,
  typeSortSchema,
} from "@eu/zod-schemas";

export type TypeFormBody = z.output<typeof typeFormSchema>;

export type TypeSortKey = z.infer<typeof typeSortSchema>;

export type TypeQuerySchema = z.infer<typeof typeQuerySchema>;

export type TypeDto = z.infer<typeof typeDtoSchema>;
export type typeDtos = TypeDto[];
