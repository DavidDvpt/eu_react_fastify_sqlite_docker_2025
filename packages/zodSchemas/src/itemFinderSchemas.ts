import z from "zod";
import { itemDtoSchema } from "./itemSchemas.js";

export const finderDtoSchema = itemDtoSchema.extend({
  depth: z.number().nullable().default(null),
  usePerMinute: z.number().nullable().default(null),
  nexusUrl: z.string().nullable().default(null),
  ammoBurn: z.number().nullable().default(null),
});
