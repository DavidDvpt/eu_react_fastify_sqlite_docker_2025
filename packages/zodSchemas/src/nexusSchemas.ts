import z from "zod";
import { booleanSchema } from "./common.js";

export const nexusParamsSchema = z.object({
  type: z.string().optional(),
});
export const nexusQuerySchema = z.object({
  id: z.string().optional(),
  type: z.string().optional(),
});

export const nexusDotSchema = z.object({
  id: z.string(),
  itemCount: z.coerce.number().int().default(0),
  imageMissingCount: z.coerce.number().int().default(0),
  changeCount: z.coerce.number().int().default(0),
  detailMissing: booleanSchema,
  createdAt: z.string(),
  insertedAt: z.string().nullable().default(null),
  updatedAt: z.string().nullable().default(null),
});
