import { z } from "zod";

export const dateSortKeySchema = z.enum(["createdAt", "updatedAt"]);
export const sortOrderEnum = z.enum(["asc", "desc"]);

export const booleanSchema = z
  .union([z.boolean(), z.enum(["true", "false"])])
  .transform((value) => value === true || value === "true");

export const idSchema = z.object({ id: z.string() });

export const genericDateSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string().nullable().default(null),
});
