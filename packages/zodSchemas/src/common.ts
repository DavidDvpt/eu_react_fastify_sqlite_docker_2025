import { z } from "zod";

export const sortOrderEnum = z.enum(["asc", "desc"]);

export const booleanSchema = z
  .union([z.boolean(), z.enum(["true", "false"])])
  .transform((value) => value === true || value === "true");

export const dateSortKeySchema = z.enum(["createdAt", "updatedAt"]);

// export const nameSortSchema = dateSortKeySchema.extend(["name"]);

export const idSchema = z.object({ id: z.string() });
