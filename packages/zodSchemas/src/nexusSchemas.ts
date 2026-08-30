import z from "zod";
import { booleanSchema } from "./common.js";

export const nexusUpdateType = z.enum([
  "Materials",
  "Finders",
  "Excavators",
  "Refiners",
]);
export const nexusParamsSchema = z.object({
  type: z.string().optional(),
});
export const nexusQuerySchema = z.object({
  id: z.string().optional(),
  type: z.string().optional(),
});

export const nexusDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  nexusRequestType: z.string().nullable().default(null),
  nexusName: z.string().optional(),
  itemCount: z.coerce.number().int().default(0),
  imageMissingCount: z.coerce.number().int().default(0),
  changeCount: z.coerce.number().int().default(0),
  createdAt: z.string(),
  insertedAt: z.string().nullable().default(null),
  updatedAt: z.string().nullable().default(null),
});

export const nexusFormSchema = z.object({
  name: z.string().min(1),
  nexusName: z.string(),
  nexusRequestType: z.string(),
});

export const nexusUpdateParamSchema = z.object({
  type: nexusUpdateType,
});
