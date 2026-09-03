import z from "zod";
import { nexusRequestTypeSchema } from "./index.js";

export const importResultSchema = z.object({
  requestType: nexusRequestTypeSchema,
  treated: z.number().default(0),
  updated: z.number().default(0),
  created: z.number().default(0),
  notFound: z.string().array(),
  error: z.string().nullable().default(null),
});
