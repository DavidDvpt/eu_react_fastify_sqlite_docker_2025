import { z } from "zod";

export const sortOrderEnum = z.enum(["asc", "desc"]);
export const optionalSortOrderHttpSchema = sortOrderEnum
  .optional()
  .or(z.literal(""))
  .transform((value) => (value ? value : undefined));

const booleanFromHttpSchema = z
  .union([z.boolean(), z.enum(["true", "false"])])
  .transform((value) => value === true || value === "true");

export const booleanHttpSchema = booleanFromHttpSchema;
export const optionalBooleanHttpSchema = booleanFromHttpSchema.optional();

export const systemSortSchema = z.object({
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
